import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth'
import { PATCH } from './route'

test('a scalar dataset edit preserves product context, repeatable data and unrelated fields', async t => {
  const dataset = {
    product_info: { sku: 'AL-42' }, bom_items: [{ id: 'input-1', name: 'Aluminium' }],
    processes: [{ name: 'Extrusion' }], custom_context: { retained: true },
    data_points: [
      { field_id: 'product_name', item_id: null, value: 'Old name' },
      { field_id: 'other_field', item_id: 'item-1', value: 'Keep me' },
    ],
  }
  const originalDataset = structuredClone(dataset)
  let saved: any
  const stub = (target: any, method: string, fn: (...args: any[]) => any) => {
    const previous = target[method]; target[method] = fn; t.after(() => { target[method] = previous })
  }
  __setCurrentUserResolver(async () => ({ id: 'editor' }) as any)
  t.after(__resetCurrentUserResolver)
  stub(prisma.project, 'findUnique', async () => ({ id: 'project', organizationId: 'org', status: 'ACTIVE', deletedAt: null, datasetVersion: 3, dataset, organization: { status: 'ACTIVE' } }))
  stub(prisma.organizationMembership, 'findFirst', async () => ({ role: 'EDITOR', inviteStatus: 'ACCEPTED' }))
  stub(prisma.datasetFieldDefinition, 'findMany', async () => [{ fieldId: 'product_name' }])
  stub(prisma.project, 'update', async (input: any) => { saved = input; return { datasetVersion: 4 } })
  const response = await PATCH(new NextRequest('http://localhost/api/projects/project/dataset', {
    method: 'PATCH', body: JSON.stringify({ field_id: 'product_name', item_id: null, value: 'New name', datasetVersion: 3 }),
  }), { params: Promise.resolve({ id: 'project' }) })
  assert.equal(response.status, 200)
  assert.deepEqual(saved.where, { id: 'project', datasetVersion: 3 })
  assert.deepEqual(saved.data.dataset, { ...originalDataset, data_points: [
    { field_id: 'product_name', item_id: null, value: 'New name' }, originalDataset.data_points[1],
  ] })
  assert.deepEqual(dataset, originalDataset, 'reading and preparing the update must not mutate the existing dataset')
})
