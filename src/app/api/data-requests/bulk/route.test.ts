import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { clearCache } from '@/lib/cache'
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth'
import { getProjectDataRequests } from '@/lib/server-data/projects'
import { GET } from '@/app/api/projects/[id]/data-requests/route'
import { POST } from './route'

test('chosen deadline reaches persistence and is returned by creation, list and page hydration', async (t) => {
  const project = { id: 'deadline-project', organizationId: 'deadline-org', createdByUserId: 'deadline-owner' }
  const contact = {
    id: '5ba5c2c7-794d-490e-a073-676057215a11',
    organizationId: project.organizationId,
    name: 'QA Supplier',
    email: 'qa@example.test',
    position: null,
  }
  const records: any[] = []
  const stub = (target: any, method: string, implementation: (...args: any[]) => any) => {
    const original = target[method]
    target[method] = implementation
    t.after(() => { target[method] = original })
  }

  // Exercise the actual request handlers/serializers; replace only the database boundary.
  __setCurrentUserResolver(async () => ({ id: 'deadline-editor' } as any))
  t.after(__resetCurrentUserResolver)
  stub(prisma.organizationMembership, 'findMany', async () => [{ organizationId: project.organizationId }])
  stub(prisma.organizationMembership, 'findFirst', async () => ({ role: 'EDITOR', organizationId: project.organizationId }))
  stub(prisma.project, 'findUnique', async () => project)
  stub(prisma.project, 'findFirst', async () => project)
  stub(prisma.contact, 'findUnique', async () => contact)
  stub(prisma.dataRequest, 'findMany', async ({ where }: any) =>
    records.filter((record) => !where.id || where.id.in.includes(record.id)),
  )
  stub(prisma.datasetFieldDefinition, 'findMany', async () => [{
    fieldId: 'supplier_energy_mwh', label: 'Supplier energy', hint: null,
  }])
  stub(prisma, '$transaction', async (operation: any) => operation({
    dataRequest: {
      createMany: async ({ data }: any) => {
        records.push(...data.map((row: any) => ({
          ...row,
          requestedAt: new Date('2026-10-10T10:00:00.000Z'),
          completedAt: null,
          revokedAt: null,
          contact,
          project: { name: 'QA Product', createdBy: { name: 'QA Owner' } },
        })))
        return { count: data.length }
      },
    },
  }))
  clearCache()
  t.after(clearCache)

  const response = await POST(new Request('http://localhost/api/data-requests/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: project.id,
      contact: { id: contact.id, email: contact.email, name: contact.name },
      deadline: '2026-10-20',
      fields: [{ dataPointId: 'supplier_energy_mwh', fieldLabel: 'Supplier energy', itemId: null }],
      mailtoPreview: { subject: 'QA request', body: 'Please provide supplier energy.' },
    }),
  }))
  const created = await response.json()
  assert.equal(response.status, 201)
  assert.equal(records.length, 1)
  assert.equal(records[0].userId, 'deadline-editor', 'attribute requests to the authenticated editor, not the project owner')
  assert.ok(records[0].deadline instanceof Date)
  assert.equal(records[0].deadline.toISOString(), '2026-10-20T00:00:00.000Z')
  assert.equal(created.requests[0].deadline, '2026-10-20T00:00:00.000Z')

  const listResponse = await GET(
    new NextRequest(`http://localhost/api/projects/${project.id}/data-requests?status=all`),
    { params: Promise.resolve({ id: project.id }) },
  )
  const listed = await listResponse.json()
  assert.equal(listResponse.status, 200)
  assert.equal(listed.requests[0].deadline, '2026-10-20T00:00:00.000Z')

  const pageRequests = await getProjectDataRequests(project.id)
  assert.equal(pageRequests[0].deadline, '2026-10-20T00:00:00.000Z')
})
