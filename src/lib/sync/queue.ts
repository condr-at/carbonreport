export interface SyncOperation {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
  status: 'pending' | 'processing' | 'failed';
  retryCount: number;
  error?: string;
}

export interface SyncResult {
  id: string;
  success: boolean;
  error?: string;
  uncertain?: boolean;
}

export const SYNC_STORAGE_KEY = 'carbon_report_sync_queue';
export const MAX_SYNC_RETRIES = 3;

const NON_IDEMPOTENT_ADDS = new Set(['dataset/add-facility', 'dataset/add-energy', 'dataset/add-bom']);
const INTERRUPTED_ADD_MESSAGE = 'Saving was interrupted. Check whether this item was saved before retrying to avoid creating it twice.';

export function operationKey(operation: SyncOperation): string {
  const { type, payload } = operation;
  if (type === 'dataset/update-field') {
    return `${type}::${payload.projectId}::${payload.fieldId}::${payload.itemId ?? 'null'}`;
  }
  if (type === 'dataset/add-item' || type === 'dataset/delete-item') {
    return `${type}::${payload.projectId}::${payload.itemId}`;
  }
  return operation.id;
}

export function restoreQueue(serialized: string | null): SyncOperation[] {
  if (!serialized) return [];
  const parsed: unknown = JSON.parse(serialized);
  if (!Array.isArray(parsed) || parsed.some((op) =>
    !op || typeof op.id !== 'string' || typeof op.type !== 'string' ||
    !op.payload || typeof op.payload !== 'object' ||
    typeof op.timestamp !== 'number' || typeof op.retryCount !== 'number' ||
    !['pending', 'processing', 'failed'].includes(op.status)
  )) {
    throw new Error('The saved changes could not be read. The stored copy has been preserved.');
  }
  return parsed.map((op: SyncOperation): SyncOperation => {
    if (op.status !== 'processing') return op;
    return NON_IDEMPOTENT_ADDS.has(op.type)
      ? { ...op, status: 'failed', error: INTERRUPTED_ADD_MESSAGE }
      : { ...op, status: 'pending' };
  });
}

export function enqueueOperation(queue: SyncOperation[], operation: SyncOperation): SyncOperation[] {
  const key = operationKey(operation);
  return [...queue.filter((existing) => {
    if (existing.status === 'processing') return true;
    if (operation.type === 'dataset/delete-item' &&
      existing.type === 'dataset/update-field' &&
      existing.payload.projectId === operation.payload.projectId &&
      existing.payload.itemId === operation.payload.itemId) return false;
    return operationKey(existing) !== key;
  }), operation];
}

export function settleBatch(queue: SyncOperation[], submitted: SyncOperation[], results: SyncResult[]): SyncOperation[] {
  const submittedIds = new Set(submitted.map((op) => op.id));
  const byId = new Map(results.map((result) => [result.id, result]));
  return queue.flatMap((op): SyncOperation[] => {
    if (!submittedIds.has(op.id)) return [op];
    const result = byId.get(op.id);
    if (result?.success) return [];
    // An edit made while this request was running supersedes the older value.
    if (queue.some((newer) => !submittedIds.has(newer.id) && operationKey(newer) === operationKey(op))) return [];
    const retryCount = op.retryCount + 1;
    const interruptedAdd = (!result || result.uncertain) && NON_IDEMPOTENT_ADDS.has(op.type);
    return [{
      ...op,
      retryCount,
      status: interruptedAdd || retryCount >= MAX_SYNC_RETRIES ? 'failed' : 'pending',
      error: interruptedAdd ? INTERRUPTED_ADD_MESSAGE : result?.error || 'The server did not confirm this change.',
    }];
  });
}

interface QueueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Writes before returning from an edit, including edits just before a reload. */
export class SyncQueueStore {
  private loaded = false;
  private readable = true;
  private queue: SyncOperation[] = [];
  error: string | null = null;

  constructor(private readonly storage: QueueStorage) {}

  load(): SyncOperation[] {
    if (this.loaded) return this.queue;
    this.loaded = true;
    try {
      this.queue = restoreQueue(this.storage.getItem(SYNC_STORAGE_KEY));
    } catch {
      this.readable = false;
      this.error = 'Saved changes could not be restored. Keep this page open; the stored copy has been preserved.';
    }
    return this.queue;
  }

  replace(queue: SyncOperation[]): SyncOperation[] {
    this.load();
    this.queue = queue;
    if (this.readable) {
      try {
        this.storage.setItem(SYNC_STORAGE_KEY, JSON.stringify(queue));
        this.error = null;
      } catch {
        this.error = 'Changes cannot be backed up in this browser. Keep this page open until they are saved.';
      }
    }
    return this.queue;
  }
}
