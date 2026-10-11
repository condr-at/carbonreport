'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { request, ApiError } from '@/lib/api-client';
import { projectKeys, userKeys } from '@/lib/data-client/keys';
import type { UserSettingsResponse } from '@/lib/data-client/user-settings';
import { notifications } from '@/components/ui/notifications';
import { enqueueOperation, acknowledgedWriteVersion, settleBatch, scopedQueueKey, SYNC_STORAGE_KEY, SyncQueueStore, type SyncOperation, type SyncResult } from './queue';
import { withDeadline } from './deadline';
import { overlayDatasetQueue } from './dataset-overlay';
import type { Dataset } from '@/lib/dataset-validation';

export type { SyncOperation } from './queue';
export interface BatchResult { timestamp: number; results: SyncResult[] }
interface SyncContextType {
  queue: SyncOperation[];
  addToQueue: (type: string, payload: Record<string, unknown>) => void;
  retryFailed: (projectId: string) => void;
  resolveConflict: (projectId: string, version: number, keepDraft: boolean) => void;
  syncNow: () => Promise<void>;
  isSyncing: boolean;
  isReady: boolean;
  storageError: string | null;
  legacyDraft: string | null;
  lastSyncTime: number | null;
  lastBatchResult: BatchResult | null;
}
const SyncContext = createContext<SyncContextType | null>(null);
const BATCH_INTERVAL_MS = 5000;
const BATCH_TIMEOUT_MS = 10000;
const isPublicPath = (path: string | null) => !path || path === '/' || /^\/(login|register|forgot-password|reset-password|verify-email|session)(\/|$)/.test(path);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<SyncOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [legacyDraft, setLegacyDraft] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [lastBatchResult, setLastBatchResult] = useState<BatchResult | null>(null);
  const storeRef = useRef<{ actorId: string; store: SyncQueueStore } | null>(null);
  const inFlightRef = useRef(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const publicPage = isPublicPath(pathname);
  const identity = useQuery<UserSettingsResponse>({
    queryKey: userKeys.settings(), queryFn: () => request('/api/user/settings'),
    enabled: !publicPage, staleTime: 0, retry: false,
  });
  const actorId = publicPage ? null : identity.data?.user.id ?? null;
  const actorRef = useRef(actorId);
  actorRef.current = actorId;

  const publishQueue = useCallback((store: SyncQueueStore, next: SyncOperation[]) => {
    const saved = store.replace(next);
    if (storeRef.current?.store === store && actorRef.current === storeRef.current.actorId) {
      setQueue(saved);
      setStorageError(store.error);
    }
  }, []);

  useEffect(() => {
    if (!actorId || identity.isFetching) {
      if (!actorId) { setQueue([]); setIsReady(false); }
      return;
    }
    try {
      const olderDraft = localStorage.getItem(SYNC_STORAGE_KEY);
      setLegacyDraft(olderDraft && olderDraft.trim() !== '[]' ? olderDraft : null);
    } catch { /* A blocked legacy store must not prevent current tab drafts. */ }
    if (storeRef.current?.actorId !== actorId) {
      // sessionStorage separates tabs while surviving reload and full login navigation.
      // Never import the old unscoped localStorage queue into a different account.
      const store = new SyncQueueStore({
        getItem: key => sessionStorage.getItem(key), setItem: (key, value) => sessionStorage.setItem(key, value),
      }, scopedQueueKey(actorId));
      storeRef.current = { actorId, store };
      const restored = store.load().map(op => op.code === 'UNAUTHORIZED'
        ? { ...op, status: 'pending' as const, code: undefined, error: undefined, retryCount: 0 } : op);
      publishQueue(store, restored);
    } else {
      setQueue(storeRef.current.store.load());
    }
    setIsReady(true);
  }, [actorId, identity.isFetching, publishQueue]);

  const processQueue = useCallback(async () => {
    const scope = storeRef.current;
    if (inFlightRef.current || !scope || actorRef.current !== scope.actorId) return;
    const { store } = scope;
    const current = store.load();
    const blocked = new Set(current.filter(op => op.status === 'failed').map(op => op.payload.projectId));
    const pending = current.filter(op => op.status === 'pending' && !blocked.has(op.payload.projectId));
    if (!pending.length) return;
    const pendingIds = new Set(pending.map(op => op.id));
    inFlightRef.current = true;
    setIsSyncing(true);
    publishQueue(store, current.map(op => pendingIds.has(op.id) ? { ...op, status: 'processing' } : op));
    let results: SyncResult[];
    try {
      const response = await withDeadline(signal => request<{ results: SyncResult[] }>('/api/batch', {
        method: 'POST', body: JSON.stringify({ operations: pending }), signal,
      }), BATCH_TIMEOUT_MS);
      const received = Array.isArray(response?.results) ? response.results : [];
      results = pending.map(op => received.find(result => result.id === op.id) ?? {
        id: op.id, success: false, uncertain: true, error: 'The server did not confirm this change.',
      });
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;
      const message = code === 'UNAUTHORIZED' ? 'Sign in again to save your draft.'
        : error instanceof Error ? error.message : 'Could not reach the server.';
      results = pending.map(op => ({ id: op.id, success: false, uncertain: true, code, error: message }));
    }

    try {
      if (actorRef.current === scope.actorId) {
        const saved = pending.filter(op => results.some(result => result.id === op.id && result.success));
        const projects = new Set(saved.map(op => op.payload.projectId));
        for (const projectId of projects) {
          if (typeof projectId !== 'string') continue;
          const written = saved.find(op => op.payload.projectId === projectId &&
            acknowledgedWriteVersion(op, results.find(result => result.id === op.id)) !== undefined);
          const version = written && acknowledgedWriteVersion(written, results.find(result => result.id === written.id));
          queryClient.setQueryData<{ dataset: Dataset | null; datasetVersion: number }>(projectKeys.dataset(projectId), old => old ? {
            ...old, dataset: overlayDatasetQueue(old.dataset, saved, projectId), datasetVersion: version ?? old.datasetVersion,
          } : old);
        }
        if (saved.length) setLastSyncTime(Date.now());
        // Acknowledged writes are durable even when the follow-up read is offline.
        // Do not hold the queue in processing while a read retries indefinitely.
        publishQueue(store, settleBatch(store.load(), pending, results));
        for (const projectId of projects) {
          if (typeof projectId === 'string') void queryClient.invalidateQueries({ queryKey: projectKeys.dataset(projectId) });
        }
        if (projects.size) void queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
        if (store.load().some(op => pendingIds.has(op.id) && op.status === 'failed')) {
          notifications.error('Some changes are not saved. Your draft is kept.');
        }
        setLastBatchResult({ timestamp: Date.now(), results });
      } else {
        // Finish only the original user's storage after a navigation/account change.
        store.replace(settleBatch(store.load(), pending, results));
      }
    } finally {
      inFlightRef.current = false;
      setIsSyncing(false);
    }
  }, [publishQueue, queryClient]);

  useEffect(() => {
    const onHidden = () => { if (document.visibilityState === 'hidden') void processQueue(); };
    const onOnline = () => void processQueue();
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('online', onOnline);
    return () => { document.removeEventListener('visibilitychange', onHidden); window.removeEventListener('online', onOnline); };
  }, [processQueue]);
  useEffect(() => {
    if (!isReady || isSyncing || !queue.some(op => op.status === 'pending')) return;
    const timer = setTimeout(() => void processQueue(), BATCH_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isReady, isSyncing, queue, processQueue]);

  const addToQueue = useCallback((type: string, payload: Record<string, unknown>) => {
    const scope = storeRef.current;
    const data = queryClient.getQueryData<{ datasetVersion: number }>(projectKeys.dataset(String(payload.projectId)));
    if (!scope || actorRef.current !== scope.actorId || !data) {
      throw new Error('Wait for your account and dataset to load before editing.');
    }
    const operation: SyncOperation = {
      id: crypto.randomUUID(), type, payload, timestamp: Date.now(), status: 'pending', retryCount: 0,
      actorId: scope.actorId, expectedDatasetVersion: data.datasetVersion,
    };
    publishQueue(scope.store, enqueueOperation(scope.store.load(), operation));
  }, [publishQueue, queryClient]);

  const retryFailed = useCallback((projectId: string) => {
    const scope = storeRef.current;
    if (!scope || scope.actorId !== actorRef.current) return;
    publishQueue(scope.store, scope.store.load().map(op => op.status === 'failed' && op.payload.projectId === projectId &&
      op.code !== 'VERSION_CONFLICT' && op.code !== 'LEGACY_DRAFT'
      ? { ...op, status: 'pending', retryCount: 0, code: undefined, error: undefined } : op));
    void processQueue();
  }, [publishQueue, processQueue]);

  const resolveConflict = useCallback((projectId: string, version: number, keepDraft: boolean) => {
    const scope = storeRef.current;
    if (!scope || scope.actorId !== actorRef.current || inFlightRef.current) return;
    publishQueue(scope.store, scope.store.load().flatMap((op): SyncOperation[] => op.payload.projectId !== projectId ? [op]
      : keepDraft ? [{ ...op, expectedDatasetVersion: version, status: 'pending', retryCount: 0, code: undefined, error: undefined }] : []));
    if (keepDraft) void processQueue();
  }, [publishQueue, processQueue]);

  return <SyncContext.Provider value={{ queue, addToQueue, retryFailed, resolveConflict, syncNow: processQueue, isSyncing, isReady,
    storageError, legacyDraft, lastSyncTime, lastBatchResult }}>{children}</SyncContext.Provider>;
}
export function useBatchSync() {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useBatchSync must be used within a SyncProvider');
  return context;
}
