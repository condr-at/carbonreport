export interface SyncOperation {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
  status: 'pending' | 'processing' | 'failed';
  retryCount: number;
  actorId: string;
  expectedDatasetVersion: number;
  error?: string;
  code?: string;
}

export interface SyncResult {
  id: string;
  success: boolean;
  error?: string;
  uncertain?: boolean;
  code?: string;
  datasetVersion?: number;
  /** True only when this request actually committed the CAS increment. */
  writeApplied?: boolean;
  currentVersion?: number;
}

export const SYNC_STORAGE_KEY = 'carbon_report_sync_queue';
export const MAX_SYNC_RETRIES = 3;

const STOP_CODES = new Set(['VERSION_CONFLICT', 'UNAUTHORIZED', 'FORBIDDEN', 'VALIDATION_ERROR', 'CONFLICT', 'NOT_FOUND', 'LEGACY_DRAFT']);

export function scopedQueueKey(actorId: string) {
  return `${SYNC_STORAGE_KEY}:${actorId}`;
}

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
    if (!op.actorId || !Number.isInteger(op.expectedDatasetVersion)) {
      return { ...op, status: 'failed', code: 'LEGACY_DRAFT', error: 'This older draft needs review before it can be saved.' };
    }
    if (op.status !== 'processing') return op;
    return { ...op, status: 'pending' };
  });
}

export function enqueueOperation(queue: SyncOperation[], operation: SyncOperation): SyncOperation[] {
  const key = operationKey(operation);
  const previous = queue.find(existing => existing.status !== 'processing' && operationKey(existing) === key);
  if (previous) {
    operation = { ...operation, expectedDatasetVersion: previous.expectedDatasetVersion,
      ...(previous.code && STOP_CODES.has(previous.code) ? { status: 'failed', code: previous.code, error: previous.error } : {}),
    };
  }
  return [...queue.filter((existing) => {
    if (existing.status === 'processing') return true;
    if (operation.type === 'dataset/delete-item' &&
      existing.type === 'dataset/update-field' &&
      existing.payload.projectId === operation.payload.projectId &&
      existing.payload.itemId === operation.payload.itemId) return false;
    return operationKey(existing) !== key;
  }), operation];
}

export function acknowledgedWriteVersion(operation: SyncOperation, result: SyncResult | undefined): number | undefined {
  return result?.success && result.writeApplied === true && result.datasetVersion === operation.expectedDatasetVersion + 1
    ? result.datasetVersion : undefined;
}

export function settleBatch(queue: SyncOperation[], submitted: SyncOperation[], results: SyncResult[]): SyncOperation[] {
  const submittedIds = new Set(submitted.map((op) => op.id));
  const byId = new Map(results.map((result) => [result.id, result]));
  return queue.flatMap((op): SyncOperation[] => {
    if (!submittedIds.has(op.id)) {
      const stopped = submitted.find(sent => sent.payload.projectId === op.payload.projectId &&
        byId.get(sent.id)?.code && STOP_CODES.has(byId.get(sent.id)!.code!));
      const rejection = stopped && byId.get(stopped.id);
      if (rejection) return [{ ...op, status: 'failed', code: rejection.code, error: rejection.error }];
      // Only advance past our own acknowledged write, never to a freshly read
      // foreign version. Edits typed while saving retain their original intent.
      const acknowledged = submitted.find(sent => sent.payload.projectId === op.payload.projectId &&
        sent.expectedDatasetVersion === op.expectedDatasetVersion && acknowledgedWriteVersion(sent, byId.get(sent.id)) !== undefined);
      const version = acknowledged && acknowledgedWriteVersion(acknowledged, byId.get(acknowledged.id));
      return [typeof version === 'number' ? { ...op, expectedDatasetVersion: version } : op];
    }
    const result = byId.get(op.id);
    if (result?.success) return [];
    // An edit made while this request was running supersedes the older value.
    if (queue.some((newer) => !submittedIds.has(newer.id) && operationKey(newer) === operationKey(op))) return [];
    const retryCount = op.retryCount + 1;
    return [{
      ...op,
      retryCount,
      status: (result?.code && STOP_CODES.has(result.code)) || retryCount >= MAX_SYNC_RETRIES ? 'failed' : 'pending',
      code: result?.code,
      error: result?.error || 'The server did not confirm this change.',
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

  constructor(private readonly storage: QueueStorage, private readonly key = SYNC_STORAGE_KEY) {}

  load(): SyncOperation[] {
    if (this.loaded) return this.queue;
    this.loaded = true;
    try {
      this.queue = restoreQueue(this.storage.getItem(this.key));
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
        this.storage.setItem(this.key, JSON.stringify(queue));
        this.error = null;
      } catch {
        this.error = 'Changes cannot be backed up in this browser. Keep this page open until they are saved.';
      }
    }
    return this.queue;
  }
}
