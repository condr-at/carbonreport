import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth';
import { POST } from './route';
import { settleBatch, type SyncOperation } from '@/lib/sync/queue';

function operation(overrides: Record<string, unknown> = {}) {
  return { id: 'op', actorId: 'editor', expectedDatasetVersion: 3, type: 'dataset/update-field',
    payload: { projectId: 'project', fieldId: 'product_name', itemId: null, value: 'My draft' }, ...overrides };
}
const initialDataset = () => ({ context: { keep: true }, data_points: [{ field_id: 'product_name', item_id: null, value: 'Original' }] });
function fixture(t: any, dataset = initialDataset(), version = 3) {
  const writes: any[] = [];
  const reads: any[] = [];
  const restores: Array<() => void> = [];
  t.after(() => { restores.reverse().forEach(restore => restore()); });
  const stub = (target: any, method: string, fn: (...args: any[]) => any) => {
    const previous = target[method]; target[method] = fn; restores.push(() => { target[method] = previous; });
  };
  __setCurrentUserResolver(async () => ({ id: 'editor' }) as any);
  t.after(__resetCurrentUserResolver);
  stub(prisma.project, 'findUnique', async (input: any) => { reads.push(input); return {
    id: 'project', organizationId: 'org', status: 'ACTIVE', deletedAt: null, datasetVersion: version, dataset,
    organization: { status: 'ACTIVE' },
  }; });
  stub(prisma.organizationMembership, 'findFirst', async () => ({ role: 'EDITOR', inviteStatus: 'ACCEPTED' }));
  stub(prisma.datasetFieldDefinition, 'findMany', async () => [{ fieldId: 'product_name' }, { fieldId: 'material_name' }]);
  stub(prisma.project, 'update', async (input: any) => { writes.push(input); return { datasetVersion: version + 1 }; });
  return { writes, reads, stub };
}
async function batch(operations: unknown[] = [operation()]) {
  const response = await POST(new NextRequest('http://localhost/api/batch', { method: 'POST', body: JSON.stringify({ operations }) }));
  return { response, body: await response.json() };
}

test('stale batch retains the other session value and returns an explicit conflict without a write', async t => {
  const dataset = initialDataset(); dataset.data_points[0].value = 'Other session';
  const f = fixture(t, dataset, 4);
  const { response, body } = await batch();
  assert.equal(response.status, 200);
  assert.equal(body.results[0].code, 'VERSION_CONFLICT');
  assert.equal(body.results[0].currentVersion, 4);
  assert.equal(f.writes.length, 0);
  assert.equal(dataset.data_points[0].value, 'Other session');
});

test('a concurrent CAS failure is a conflict, never reread and silently replayed', async t => {
  const f = fixture(t);
  f.stub(prisma.project, 'update', async (input: any) => { f.writes.push(input); throw { code: 'P2025' }; });
  const { body } = await batch();
  assert.equal(body.results[0].code, 'VERSION_CONFLICT');
  assert.equal(f.writes.length, 1);
  assert.equal(f.reads.length, 1);
  assert.equal(f.writes[0].where.datasetVersion, 3);
});

test('a lost successful response can be acknowledged again without a second version increment', async t => {
  const dataset = initialDataset(); dataset.data_points[0].value = 'My draft';
  const f = fixture(t, dataset, 4);
  const { body } = await batch();
  assert.deepEqual(body.results, [{ id: 'op', success: true, datasetVersion: 4, writeApplied: false }]);
  assert.equal(f.writes.length, 0);
});

test('accepted batch commits once and preserves unrelated dataset context', async t => {
  const dataset = initialDataset(); const original = structuredClone(dataset);
  const f = fixture(t, dataset);
  const { body } = await batch();
  assert.deepEqual(body.results, [{ id: 'op', success: true, datasetVersion: 4, writeApplied: true }]);
  assert.equal(f.writes.length, 1);
  assert.deepEqual(f.writes[0].data.dataset.context, { keep: true });
  assert.deepEqual(dataset, original);
  assert.equal(f.writes[0].data.datasetVersion.increment, 1);
});

test('new repeatable rows persist blank placeholders and replay does not duplicate them', async t => {
  const f = fixture(t);
  const add = operation({ type: 'dataset/add-item', payload: { projectId: 'project', repeatableKey: 'material_input', itemId: 'client-id', fieldIds: ['material_name'] } });
  assert.equal((await batch([add])).body.results[0].success, true);
  const saved = f.writes[0].data.dataset;
  assert.deepEqual(saved.data_points[1], { field_id: 'material_name', item_id: 'client-id', value: '' });
  f.stub(prisma.project, 'findUnique', async () => ({ id: 'project', organizationId: 'org', status: 'ACTIVE', datasetVersion: 4, dataset: saved, organization: { status: 'ACTIVE' } }));
  assert.equal((await batch([add])).body.results[0].datasetVersion, 4);
  assert.equal(f.writes.length, 1);
});

test('another signed-in editor cannot replay a different account draft', async t => {
  const f = fixture(t);
  const { response, body } = await batch([operation({ actorId: 'original-owner' })]);
  assert.equal(response.status, 401);
  assert.equal(body.code, 'UNAUTHORIZED');
  assert.equal(f.reads.length, 0);
  assert.equal(f.writes.length, 0);
});

test('batch version is mandatory and missing/negative versions never reach the database', async t => {
  const f = fixture(t);
  for (const expectedDatasetVersion of [undefined, -1]) {
    const { response } = await batch([operation({ expectedDatasetVersion })]);
    assert.equal(response.status, 400);
  }
  assert.equal(f.reads.length, 0);
});

test('stable facility, energy and BOM IDs make an uncertain addition safe to replay', async t => {
  const f = fixture(t);
  const cases = [
    { type: 'dataset/add-facility', key: 'facilities', payloadKey: 'facility', value: { id: 'facility', name: 'Factory', address: 'Street', country: 'RS' } },
    { type: 'dataset/add-energy', key: 'energy_entries', payloadKey: 'entry', value: { id: 'energy', facilityId: 'facility', source: 'electricity', amount: 12, unit: 'kWh' } },
    { type: 'dataset/add-bom', key: 'bom_items', payloadKey: 'item', value: { id: 'bom', name: 'Steel', weight: 2, origin: 'RS', materialType: 'metal' } },
  ];
  for (const item of cases) {
    const dataset = { ...initialDataset(), [item.key]: [item.value] };
    f.stub(prisma.project, 'findUnique', async () => ({ id: 'project', organizationId: 'org', status: 'ACTIVE', datasetVersion: 4, dataset, organization: { status: 'ACTIVE' } }));
    const { body } = await batch([operation({ type: item.type, payload: { projectId: 'project', [item.payloadKey]: item.value } })]);
    assert.equal(body.results[0].success, true);
    assert.equal(body.results[0].datasetVersion, 4);
    assert.equal(f.writes.length, 0);
  }
});


test('a matching replay cannot authorize a queued edit over another session newer value', async t => {
  const dataset = initialDataset();
  dataset.data_points[0].value = 'My draft';
  dataset.data_points.push({ field_id: 'material_name', item_id: null, value: 'Other editor material' });
  const f = fixture(t, dataset, 8);
  const submitted = { ...operation(), timestamp: 1, status: 'processing', retryCount: 0 } as SyncOperation;
  const newer = { ...operation({ id: 'next', payload: { projectId: 'project', fieldId: 'material_name', itemId: null, value: 'Stale editor material' } }), timestamp: 2, status: 'pending', retryCount: 0 } as SyncOperation;
  const replay = await batch([operation()]);
  assert.equal(replay.body.results[0].success, true);
  assert.equal(replay.body.results[0].writeApplied, false);
  const queue = settleBatch([submitted, newer], [submitted], replay.body.results);
  const nextResponse = await batch(queue);
  assert.equal(nextResponse.body.results[0].code, 'VERSION_CONFLICT');
  assert.equal(f.writes.length, 0);
  assert.equal(dataset.data_points[1].value, 'Other editor material');
});


for (const item of [
  { entity: 'facility', key: 'facilities', payloadKey: 'facility', idKey: 'facilityId', field: 'name', edited: 'Filled factory', foreign: 'Other factory', value: { id: 'facility', name: '', address: '', country: '' } },
  { entity: 'energy', key: 'energy_entries', payloadKey: 'entry', idKey: 'energyId', field: 'amount', edited: 42, foreign: 99, value: { id: 'energy', facilityId: 'facility', source: 'electricity', amount: 0, unit: 'kWh' } },
  { entity: 'bom', key: 'bom_items', payloadKey: 'item', idKey: 'bomId', field: 'name', edited: 'Filled steel', foreign: 'Other material', value: { id: 'bom', name: '', weight: 0, origin: '', materialType: '' } },
]) {
  test(`${item.entity} add plus edit replays as one no-op and cannot replace a foreign UUID value`, async t => {
    const f = fixture(t);
    const state: { dataset: any; version: number } = { dataset: initialDataset(), version: 3 };
    f.stub(prisma.project, 'findUnique', async () => ({ id: 'project', organizationId: 'org', status: 'ACTIVE', datasetVersion: state.version, dataset: state.dataset, organization: { status: 'ACTIVE' } }));
    f.stub(prisma.project, 'update', async (input: any) => {
      assert.equal(input.where.datasetVersion, state.version);
      f.writes.push(input); state.dataset = structuredClone(input.data.dataset); state.version++;
      return { datasetVersion: state.version };
    });
    const addition = operation({ id: 'add', type: `dataset/add-${item.entity}`, payload: { projectId: 'project', [item.payloadKey]: item.value } });
    const edit = operation({ id: 'edit', type: `dataset/update-${item.entity}`, payload: { projectId: 'project', [item.idKey]: item.value.id, field: item.field, value: item.edited } });
    const first = await batch([addition, edit]);
    assert.ok(first.body.results.every((result: any) => result.success && result.writeApplied));
    assert.equal(state.version, 4);
    assert.equal(state.dataset[item.key].length, 1);
    assert.equal(state.dataset[item.key][0][item.field], item.edited);
    const replay = await batch([addition, edit]);
    assert.ok(replay.body.results.every((result: any) => result.success && result.writeApplied === false && result.datasetVersion === 4));
    assert.equal(f.writes.length, 1, 'the exact uncertain replay must not increment the dataset again');

    state.dataset[item.key][0][item.field] = item.foreign;
    state.version = 5;
    const foreignSnapshot = structuredClone(state.dataset);
    const changedReplay = await batch([addition, edit]);
    assert.ok(changedReplay.body.results.every((result: any) => result.code === 'VERSION_CONFLICT'));
    const freshCollision = await batch([{ ...addition, expectedDatasetVersion: 5 }, { ...edit, expectedDatasetVersion: 5 }]);
    assert.ok(freshCollision.body.results.every((result: any) => result.code === 'VERSION_CONFLICT'));
    assert.equal(f.writes.length, 1);
    assert.deepEqual(state.dataset, foreignSnapshot, 'neither a stale replay nor a fresh UUID collision may replace another value');
  });
}
