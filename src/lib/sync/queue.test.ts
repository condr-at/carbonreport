import assert from 'node:assert/strict';
import test from 'node:test';
import { enqueueOperation, acknowledgedWriteVersion, restoreQueue, settleBatch, SyncQueueStore, SYNC_STORAGE_KEY, scopedQueueKey, type SyncOperation } from './queue';
import { overlayDatasetQueue } from './dataset-overlay';

function edit(id: string, value = 'Aluminium Profile 40x40', overrides: Partial<SyncOperation> = {}): SyncOperation {
  return {
    id, type: 'dataset/update-field', timestamp: 1, status: 'pending', retryCount: 0, actorId: 'user-1', expectedDatasetVersion: 3,
    payload: { projectId: 'project-1', fieldId: 'product_name', itemId: null, value }, ...overrides,
  };
}

function memoryStorage(initial: string | null = null) {
  let value = initial;
  return {
    getItem: (key: string) => { assert.equal(key, SYNC_STORAGE_KEY); return value; },
    setItem: (key: string, next: string) => { assert.equal(key, SYNC_STORAGE_KEY); value = next; },
  };
}

test('mount/repeated hydration never overwrites stored edits with the initial empty state', () => {
  const storage = memoryStorage(JSON.stringify([edit('pending'), edit('in-flight', 'New name', { status: 'processing' })]));
  const store = new SyncQueueStore(storage);
  assert.deepEqual(store.load().map((op) => op.status), ['pending', 'pending']);
  assert.equal(store.load().length, 2);
  assert.equal(JSON.parse(storage.getItem(SYNC_STORAGE_KEY)!).length, 2);
});

test('an edit is durable before returning and survives immediate reload and server-data overlay', () => {
  const storage = memoryStorage();
  const store = new SyncQueueStore(storage);
  store.replace(enqueueOperation(store.load(), edit('product')));
  const recovered = new SyncQueueStore(storage).load();
  assert.equal(recovered[0].payload.value, 'Aluminium Profile 40x40');
  const server = { data_points: [{ field_id: 'organization_name', item_id: null, value: 'Acme' }] };
  const visible = overlayDatasetQueue(server, recovered, 'project-1');
  assert.equal(visible?.data_points.find((point) => point.field_id === 'product_name')?.value, 'Aluminium Profile 40x40');
  assert.equal(server.data_points.length, 1, 'overlay must not mutate the server snapshot');
});

test('retry exhaustion preserves failed values across reload; missing batch results are failures too', () => {
  const pending = edit('failed', 'Keep my value', { retryCount: 2, status: 'processing' });
  const next = settleBatch([pending], [pending], []);
  assert.equal(next.length, 1);
  assert.equal(next[0].status, 'failed');
  assert.match(next[0].error!, /did not confirm/);
  const restored = restoreQueue(JSON.stringify(next));
  assert.equal(restored[0].status, 'failed');
  assert.equal(overlayDatasetQueue({ data_points: [] }, restored, 'project-1')?.data_points[0].value, 'Keep my value');
});

test('interrupted additions retain their stable IDs and original version for idempotent replay', () => {
  for (const type of ['dataset/add-facility', 'dataset/add-energy', 'dataset/add-bom']) {
    const operation = edit(type, '', { type, status: 'processing' });
    const restored = restoreQueue(JSON.stringify([operation]));
    assert.equal(restored[0].status, 'pending');
    assert.equal(restored[0].id, operation.id);
    assert.equal(restored[0].expectedDatasetVersion, 3);
    assert.equal(settleBatch([operation], [operation], [])[0].status, 'pending');
  }
});

test('a new edit during an in-flight request survives its success and supersedes its failure', () => {
  const old = edit('old', 'Old value', { status: 'processing' });
  const newer = edit('new', 'New value');
  const queue = enqueueOperation([old], newer);
  assert.equal(queue.length, 2);
  for (const success of [true, false]) {
    assert.deepEqual(settleBatch(queue, [old], [{ id: old.id, success }]), [newer]);
  }
});

test('only acknowledged operations are removed; unrelated project changes stay queued', () => {
  const first = edit('first');
  const second = edit('second', 'Other project', { payload: { ...first.payload, projectId: 'project-2' } });
  assert.deepEqual(settleBatch([first, second], [first], [{ id: 'first', success: true }]), [second]);
  assert.equal(overlayDatasetQueue({ data_points: [] }, [second], 'project-1')?.data_points.length, 0);
});

test('multiple new repeatable items are retained and deletion is scoped to its project', () => {
  const first = edit('add-1', '', { type: 'dataset/add-item', payload: { projectId: 'p', repeatableKey: 'material', itemId: '1' } });
  const second = edit('add-2', '', { type: 'dataset/add-item', payload: { projectId: 'p', repeatableKey: 'material', itemId: '2' } });
  assert.equal(enqueueOperation([first], second).length, 2);
  const otherProjectEdit = edit('edit', 'Keep', { payload: { projectId: 'other', fieldId: 'name', itemId: '1', value: 'Keep' } });
  const removal = edit('delete', '', { type: 'dataset/delete-item', payload: { projectId: 'p', itemId: '1' } });
  assert.ok(enqueueOperation([otherProjectEdit], removal).includes(otherProjectEdit));
});

test('corrupt storage is preserved, and unavailable storage reports a visible recovery warning', () => {
  const storage = memoryStorage('{invalid');
  const corrupt = new SyncQueueStore(storage);
  assert.deepEqual(corrupt.load(), []);
  corrupt.replace([edit('in-memory')]);
  assert.equal(storage.getItem(SYNC_STORAGE_KEY), '{invalid');
  assert.match(corrupt.error!, /preserved/);
  const unavailable = new SyncQueueStore({ getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } });
  unavailable.replace([edit('memory')]);
  assert.equal(unavailable.load().length, 1);
  assert.match(unavailable.error!, /Keep this page open/);
});

test('conflicts stop automatic replay and subsequent typing retains the original base and conflict', () => {
  const first = edit('first');
  const conflicted = settleBatch([first], [first], [{ id: first.id, success: false, code: 'VERSION_CONFLICT' }]);
  assert.equal(conflicted[0].status, 'failed');
  const newer = enqueueOperation(conflicted, edit('second', 'Still my draft', { expectedDatasetVersion: 8 }));
  assert.equal(newer[0].expectedDatasetVersion, 3);
  assert.equal(newer[0].status, 'failed');
  assert.equal(newer[0].code, 'VERSION_CONFLICT');
  assert.equal(newer[0].payload.value, 'Still my draft');
});

test('only an acknowledged own write advances edits typed during flight; an error never rebases them', () => {
  const first = edit('first', 'First', { status: 'processing' });
  const newer = edit('second', 'Second');
  const queue = enqueueOperation([first], newer);
  const saved = settleBatch(queue, [first], [{ id: first.id, success: true, datasetVersion: 4, writeApplied: true }]);
  assert.equal(saved[0].expectedDatasetVersion, 4);
  const failed = settleBatch(queue, [first], [{ id: first.id, success: false, code: 'VERSION_CONFLICT', currentVersion: 9 }]);
  assert.equal(failed[0].expectedDatasetVersion, 3);
  assert.equal(failed[0].status, 'failed');
  assert.equal(failed[0].code, 'VERSION_CONFLICT');
});

test('account storage keys and tab storage objects keep draft values independent', () => {
  const firstTab = new Map<string, string>();
  const secondTab = new Map<string, string>();
  const storage = (tab: Map<string, string>) => ({ getItem: (key: string) => tab.get(key) ?? null, setItem: (key: string, value: string) => { tab.set(key, value); } });
  const owner = new SyncQueueStore(storage(firstTab), scopedQueueKey('owner'));
  owner.replace([edit('owner')]);
  assert.deepEqual(new SyncQueueStore(storage(firstTab), scopedQueueKey('editor')).load(), []);
  assert.deepEqual(new SyncQueueStore(storage(secondTab), scopedQueueKey('owner')).load(), []);
  assert.equal(new SyncQueueStore(storage(firstTab), scopedQueueKey('owner')).load()[0].id, 'owner');
});

test('legacy drafts lacking actor/version are preserved but never automatically submitted', () => {
  const legacy: Partial<SyncOperation> = { ...edit('legacy') };
  delete legacy.actorId;
  delete legacy.expectedDatasetVersion;
  const restored = restoreQueue(JSON.stringify([legacy]));
  assert.equal(restored[0].status, 'failed');
  assert.equal(restored[0].code, 'LEGACY_DRAFT');
  assert.equal(restored[0].payload.value, legacy.payload!.value);
});


test('idempotent acknowledgement at another editor version cannot rebase edits typed during flight', () => {
  const submitted = edit('submitted', 'Already present', { status: 'processing' });
  const newer = edit('newer', 'My next draft', { payload: { projectId: 'project-1', fieldId: 'material_name', itemId: null, value: 'My next draft' } });
  const result = { id: submitted.id, success: true, datasetVersion: 8, writeApplied: false };
  const remaining = settleBatch([submitted, newer], [submitted], [result]);
  assert.deepEqual(remaining, [newer], 'acknowledge only the matching value, retain the next edit base');
  assert.equal(remaining[0].expectedDatasetVersion, 3);
  assert.equal(acknowledgedWriteVersion(submitted, result), undefined, 'a no-op must not promote the cached snapshot version either');
  assert.equal(acknowledgedWriteVersion(submitted, { ...result, writeApplied: undefined }), undefined);
  assert.equal(acknowledgedWriteVersion(submitted, { ...result, writeApplied: true }), undefined, 'a real CAS acknowledgement advances exactly one version');
});
