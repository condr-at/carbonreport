'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { request } from '@/lib/api-client';
import { notifications } from '@/components/ui/notifications';

export interface SyncOperation {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
    status: 'pending' | 'processing' | 'failed';
    retryCount: number;
}

export interface BatchResult {
    timestamp: number;
    results: Array<{ id: string; success: boolean; error?: string }>;
}

interface SyncContextType {
    queue: SyncOperation[];
    addToQueue: (type: string, payload: any) => void;
    isSyncing: boolean;
    lastSyncTime: number | null;
    lastBatchResult: BatchResult | null;
}

const SyncContext = createContext<SyncContextType | null>(null);

const STORAGE_KEY = 'carbon_report_sync_queue';
const BATCH_INTERVAL_MS = 5000;
const MAX_RETRIES = 3;

export function SyncProvider({ children }: { children: React.ReactNode }) {
    const [queue, setQueue] = useState<SyncOperation[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
    const [lastBatchResult, setLastBatchResult] = useState<BatchResult | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();
    const prevPathname = useRef(pathname);

    // Load queue from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setQueue(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load sync queue', e);
        }
    }, []);

    // Persist queue to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        } catch (e) {
            console.error('Failed to save sync queue', e);
        }
    }, [queue]);

    const processQueue = useCallback(async () => {
        if (isSyncing || queue.length === 0) {
            return;
        }

        const pending = queue.filter((op) => op.status === 'pending');
        if (pending.length === 0) {
            return;
        }

        setIsSyncing(true);

        // Mark items as processing
        setQueue((prev) =>
            prev.map((op) =>
                pending.find((p) => p.id === op.id) ? { ...op, status: 'processing' } : op
            )
        );

        try {
            const response = await request<{ results: Array<{ id: string; success: boolean; error?: string }> }>('/api/batch', {
                method: 'POST',
                body: JSON.stringify({ operations: pending }),
            });

            const results = response.results || [];
            const successIds = new Set(results.filter((r) => r.success).map((r) => r.id));
            const failedIds = new Set(results.filter((r) => !r.success).map((r) => r.id));

            console.log('[SyncManager] Batch sent', {
                operationCount: pending.length,
                successCount: successIds.size,
                failCount: failedIds.size,
                timestamp: Date.now(),
            });

            // Check for permanent failures (items that will be dropped)
            const permanentFailures = results.filter(r => {
                if (r.success) return false;
                const op = pending.find(p => p.id === r.id);
                return op && op.retryCount >= MAX_RETRIES - 1;
            });

            if (permanentFailures.length > 0) {
                notifications.error(`Failed to sync ${permanentFailures.length} changes. Please refresh the page.`);
            }

            setQueue((prev) => {
                const nextQueue = prev.filter((op) => {
                    // Remove successful items
                    if (successIds.has(op.id)) {
                        return false;
                    }
                    // Keep failed items if retry count < MAX_RETRIES, else remove (or move to dead letter queue)
                    if (failedIds.has(op.id)) {
                        return op.retryCount < MAX_RETRIES;
                    }
                    // Keep items not in this batch
                    return true;
                });

                // Update retry counts for failed items
                return nextQueue.map((op) => {
                    if (failedIds.has(op.id)) {
                        return { ...op, status: 'pending', retryCount: op.retryCount + 1 };
                    }
                    return op;
                });
            });

            setLastSyncTime(Date.now());

            if (failedIds.size > 0) {
                console.warn('Some batch operations failed', results.filter(r => !r.success));
                // Optional: Notify user if critical failures
            }

            setLastBatchResult({
                timestamp: Date.now(),
                results,
            });

        } catch (error) {
            console.error('Batch sync failed', error);
            // Mark all as pending to retry
            setQueue((prev) =>
                prev.map((op) =>
                    pending.find((p) => p.id === op.id)
                        ? { ...op, status: 'pending', retryCount: op.retryCount + 1 }
                        : op
                )
            );
            notifications.error('Sync failed. Retrying...');
        } finally {
            setIsSyncing(false);
        }
    }, [queue, isSyncing]);

    // Trigger sync on navigation
    useEffect(() => {
        if (pathname !== prevPathname.current) {
            prevPathname.current = pathname;
            void processQueue(); // Send immediately
        }
    }, [pathname, processQueue]);

    // Trigger sync on visibility change (tab close/hide)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                void processQueue();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [processQueue]);

    // Debounce sync
    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const pendingCount = queue.filter((op) => op.status === 'pending').length;
        if (pendingCount > 0) {
            timerRef.current = setTimeout(() => {
                void processQueue();
            }, BATCH_INTERVAL_MS);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [queue, processQueue]);

    const addToQueue = useCallback((type: string, payload: any) => {
        setQueue((prev) => {
            const nextQueue = [...prev];

            // Generate a unique key for deduplication
            let key = '';
            if (type === 'dataset/update-field') {
                key = `${type}::${payload.projectId}::${payload.fieldId}::${payload.itemId ?? 'null'}`;
            } else if (type === 'dataset/add-item') {
                key = `${type}::${payload.projectId}::${payload.repeatableKey}`;
            } else if (type === 'dataset/delete-item') {
                key = `${type}::${payload.projectId}::${payload.itemId}`;
            } else {
                // Fallback for unknown types: no deduplication
                key = crypto.randomUUID();
            }

            // Conflict Resolution: Handle add/delete pairs
            if (type === 'dataset/delete-item') {
                // Check if we have a pending "add-item" for this item (if we could track temporary IDs)
                // Since we don't have the temp ID in add-item payload easily accessible or linked yet without more complex logic,
                // we will focus on the primary requested logic: deduplication of updates.

                // However, if we delete an item, we should remove any pending field updates for that item
                const updatesToRemove = nextQueue.filter(op =>
                    op.type === 'dataset/update-field' &&
                    op.payload.itemId === payload.itemId
                );

                updatesToRemove.forEach(op => {
                    const idx = nextQueue.indexOf(op);
                    if (idx > -1) nextQueue.splice(idx, 1);
                });
            }

            // Deduplication: Remove existing operation with the same key
            // We only deduplicate pending operations, not those already processing
            const existingIdx = nextQueue.findIndex(op =>
                op.status === 'pending' &&
                op.type === type &&
                getOperationKey(op) === key
            );

            if (existingIdx > -1) {
                // Replace existing operation
                nextQueue[existingIdx] = {
                    ...nextQueue[existingIdx],
                    payload,
                    timestamp: Date.now(),
                };
                return nextQueue;
            }

            // Add new operation
            const operation: SyncOperation = {
                id: crypto.randomUUID(),
                type,
                payload,
                timestamp: Date.now(),
                status: 'pending',
                retryCount: 0,
                // Store the key for future lookups if needed, or re-generate it
            };

            return [...nextQueue, operation];
        });
    }, []);

    // Helper to reconstruct key from operation
    const getOperationKey = (op: SyncOperation) => {
        if (op.type === 'dataset/update-field') {
            return `${op.type}::${op.payload.projectId}::${op.payload.fieldId}::${op.payload.itemId ?? 'null'}`;
        } else if (op.type === 'dataset/add-item') {
            return `${op.type}::${op.payload.projectId}::${op.payload.repeatableKey}`;
        } else if (op.type === 'dataset/delete-item') {
            return `${op.type}::${op.payload.projectId}::${op.payload.itemId}`;
        }
        return op.id; // No deduplication
    };

    return (
        <SyncContext.Provider value={{ queue, addToQueue, isSyncing, lastSyncTime, lastBatchResult }}>
            {children}
        </SyncContext.Provider>
    );
}

export function useBatchSync() {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error('useBatchSync must be used within a SyncProvider');
    }
    return context;
}
