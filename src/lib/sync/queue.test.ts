import assert from 'node:assert/strict';
import test from 'node:test';
import { enqueueOperation, restoreQueue, settleBatch, SyncQueueStore, SYNC_STORAGE_KEY, type SyncOperation } from './queue';
import { overlayDatasetQueue } from './dataset-overlay';

function edit(id: string, value = 'Aluminium Profile 40x40', overrides: Partial<SyncOperation> = {}): SyncOperation {
  return {
    id, type: 'dataset/update-field', timestamp: 1, status: 'pending', retryCount: 0,
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

test('uncertain non-idempotent additions require review instead of automatic replay', () => {
  for (const type of ['dataset/add-facility', 'dataset/add-energy', 'dataset/add-bom']) {
    const operation = edit(type, '', { type, status: 'processing' });
    const restored = restoreQueue(JSON.stringify([operation]));
    assert.equal(restored[0].status, 'failed');
    assert.match(restored[0].error!, /before retrying/);
    assert.equal(settleBatch([operation], [operation], [])[0].status, 'failed');
    assert.equal(settleBatch([operation], [operation], [{ id: operation.id, success: false, uncertain: true }])[0].status, 'failed');
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
