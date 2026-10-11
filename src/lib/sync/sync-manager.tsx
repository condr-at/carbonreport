'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { request } from '@/lib/api-client';
import { projectKeys } from '@/lib/data-client/keys';
import { notifications } from '@/components/ui/notifications';
import { enqueueOperation, settleBatch, SyncQueueStore, type SyncOperation, type SyncResult } from './queue';
import { overlayDatasetQueue } from './dataset-overlay';
import type { Dataset } from '@/lib/dataset-validation';

export type { SyncOperation } from './queue';

export interface BatchResult {
  timestamp: number;
  results: SyncResult[];
}

interface SyncContextType {
  queue: SyncOperation[];
  addToQueue: (type: string, payload: Record<string, unknown>) => void;
  retryFailed: (projectId: string) => void;
  syncNow: () => Promise<void>;
  isSyncing: boolean;
  isReady: boolean;
  storageError: string | null;
  lastSyncTime: number | null;
  lastBatchResult: BatchResult | null;
}

const SyncContext = createContext<SyncContextType | null>(null);
const BATCH_INTERVAL_MS = 5000;

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<SyncOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [lastBatchResult, setLastBatchResult] = useState<BatchResult | null>(null);
  const storeRef = useRef<SyncQueueStore | null>(null);
  const inFlightRef = useRef(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  const getStore = useCallback(() => {
    if (!storeRef.current) {
      storeRef.current = new SyncQueueStore({
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
      });
    }
    return storeRef.current;
  }, []);

  const publishQueue = useCallback((next: SyncOperation[]) => {
    const store = getStore();
    setQueue(store.replace(next));
    setStorageError(store.error);
  }, [getStore]);

  useEffect(() => {
    const store = getStore();
    setQueue(store.load());
    setStorageError(store.error);
    setIsReady(true);
  }, [getStore]);

  const processQueue = useCallback(async () => {
    // Guard overlapping timer/navigation events before React rerenders.
    if (inFlightRef.current) return;
    const store = getStore();
    const pending = store.load().filter((op) => op.status === 'pending');
    if (pending.length === 0) return;
    const pendingIds = new Set(pending.map((op) => op.id));
    inFlightRef.current = true;
    setIsSyncing(true);
    publishQueue(store.load().map((op) => pendingIds.has(op.id) ? { ...op, status: 'processing' } : op));

    let results: SyncResult[];
    try {
      const response = await request<{ results: SyncResult[] }>('/api/batch', {
        method: 'POST',
        body: JSON.stringify({ operations: pending }),
      });
      const received = Array.isArray(response?.results) ? response.results : [];
      results = pending.map((op) => received.find((result) => result.id === op.id) ?? {
        id: op.id, success: false, uncertain: true, error: 'The server did not confirm this change.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not reach the server.';
      results = pending.map((op) => ({ id: op.id, success: false, uncertain: true, error: message }));
    }

    try {
      const successfulIds = new Set(results.filter((result) => result.success).map((result) => result.id));
      const savedOperations = pending.filter((op) => successfulIds.has(op.id));
      const projects = new Set(savedOperations.map((op) => op.payload.projectId));
      const refreshes: Promise<unknown>[] = [];
      for (const projectId of projects) {
        if (typeof projectId !== 'string') continue;
        const queryKey = projectKeys.dataset(projectId);
        // Keep acknowledged values if the follow-up read fails. Keep the queue overlay
        // visible until that read finishes so the UI cannot flash the old server data.
        queryClient.setQueryData<{ dataset: Dataset | null }>(queryKey, (current) => current ? {
          ...current,
          dataset: overlayDatasetQueue(current.dataset, savedOperations, projectId),
        } : current);
        refreshes.push(queryClient.invalidateQueries({ queryKey }));
      }
      if (projects.size > 0) {
        refreshes.push(queryClient.invalidateQueries({ queryKey: ['projects', 'list'] }));
      }
      await Promise.allSettled(refreshes);
      if (successfulIds.size) setLastSyncTime(Date.now());
    } finally {
      // Read the current queue after refetch: edits made during the read must survive.
      const next = settleBatch(store.load(), pending, results);
      publishQueue(next);
      if (next.some((op) => pendingIds.has(op.id) && op.status === 'failed')) {
        notifications.error('Some changes are not saved. Your edits remain visible; retry saving.');
      }
      setLastBatchResult({ timestamp: Date.now(), results });
      inFlightRef.current = false;
      setIsSyncing(false);
    }
  }, [getStore, publishQueue, queryClient]);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      void processQueue();
    }
  }, [pathname, processQueue]);

  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden') void processQueue();
    };
    const onOnline = () => void processQueue();
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('online', onOnline);
    };
  }, [processQueue]);

  useEffect(() => {
    if (!isReady || isSyncing || !queue.some((op) => op.status === 'pending')) return;
    const timer = setTimeout(() => void processQueue(), BATCH_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isReady, isSyncing, queue, processQueue]);

  const addToQueue = useCallback((type: string, payload: Record<string, unknown>) => {
    const operation: SyncOperation = {
      id: crypto.randomUUID(), type, payload, timestamp: Date.now(), status: 'pending', retryCount: 0,
    };
    publishQueue(enqueueOperation(getStore().load(), operation));
  }, [getStore, publishQueue]);

  const retryFailed = useCallback((projectId: string) => {
    publishQueue(getStore().load().map((op) => op.status === 'failed' && op.payload.projectId === projectId
      ? { ...op, status: 'pending', retryCount: 0, error: undefined }
      : op));
    void processQueue();
  }, [getStore, publishQueue, processQueue]);

  return (
    <SyncContext.Provider value={{ queue, addToQueue, retryFailed, syncNow: processQueue, isSyncing, isReady, storageError, lastSyncTime, lastBatchResult }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useBatchSync() {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useBatchSync must be used within a SyncProvider');
  return context;
}
