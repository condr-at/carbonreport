import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth'
import { clearCache, setCacheValue } from '@/lib/cache'
import { completeRequestsBulk, reassignRequestsBulk, resendRequestsBulk, revokeRequestsBulk } from '@/lib/data-requests/service'
import { GET as getContacts } from '@/app/api/projects/[id]/contacts/route'
import { GET } from './route'

test('reads immediately reflect request mutations even when a stale response survives in a local cache', async (t) => {
  const project = { id: 'fresh-project', organizationId: 'fresh-org', name: 'QA project', createdBy: { name: 'QA owner' } }
  const contacts = [
    { id: 'contact-old', organizationId: project.organizationId, name: 'Old supplier', email: 'old@example.test', position: null },
    { id: 'contact-new', organizationId: project.organizationId, name: 'New supplier', email: 'new@example.test', position: null },
  ]
  const records: any[] = [{
    id: 'request-old', userId: 'qa-editor', projectId: project.id, project,
    contactId: contacts[0].id, contact: contacts[0],
    dataPointId: 'supplier_energy_mwh', fieldLabel: 'Supplier energy', itemId: null,
    requestedAt: new Date('2026-10-10T10:00:00.000Z'),
    completedAt: null, revokedAt: null, deadline: new Date('2026-10-20T00:00:00.000Z'), externalAccess: false,
  }]
  const matches = (row: any, where: any) =>
    (!where.id || where.id.in.includes(row.id)) &&
    (!where.projectId || where.projectId === row.projectId) &&
    (where.completedAt !== null || row.completedAt === null) &&
    (where.revokedAt !== null || row.revokedAt === null)
  const stub = (target: any, method: string, implementation: (...args: any[]) => any) => {
    const original = target[method]
    target[method] = implementation
    t.after(() => { target[method] = original })
  }
  stub(prisma.organizationMembership, 'findMany', async () => [{ organizationId: project.organizationId }])
  stub(prisma.project, 'findFirst', async () => project)
  stub(prisma.contact, 'findUnique', async ({ where }: any) => contacts.find((contact) => contact.id === where.id) ?? null)
  stub(prisma.contact, 'findMany', async () => contacts)
  stub(prisma.datasetFieldDefinition, 'findMany', async () => [])
  stub(prisma.dataRequest, 'findMany', async ({ where }: any) => records.filter((row) => matches(row, where)))
  stub(prisma.dataRequest, 'updateMany', async ({ where, data }: any) => {
    const selected = records.filter((row) => matches(row, where))
    selected.forEach((row) => Object.assign(row, data))
    return { count: selected.length }
  })
  stub(prisma.dataRequest, 'createMany', async ({ data }: any) => {
    records.push(...data.map((row: any) => ({ ...row, project, contact: contacts.find((contact) => contact.id === row.contactId) })))
    return { count: data.length }
  })
  stub(prisma, '$transaction', async (operation: any) => operation({ dataRequest: prisma.dataRequest }))
  __setCurrentUserResolver(async () => ({ id: 'qa-editor' } as any))
  t.after(__resetCurrentUserResolver)
  clearCache()
  t.after(clearCache)

  const params = { params: Promise.resolve({ id: project.id }) }
  const url = `http://localhost/api/projects/${project.id}/data-requests?status=all`
  const cacheKey = `project:data-requests:${project.id}:all:all:requested_at`
  const read = async () => {
    const response = await GET(new NextRequest(url), params)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
    return response.json()
  }
  const beforeReassign = await read()
  const reassigned = await reassignRequestsBulk(
    ['request-old'], contacts[1], 'qa-editor', new Date('2026-10-10T11:00:00.000Z'),
  )
  const newId = reassigned.requests[0].id
  // Model a separate route worker or an in-flight pre-mutation GET retaining
  // the old response after the mutation worker already invalidated its copy.
  setCacheValue(cacheKey, beforeReassign)
  const afterReassign = await read()
  assert.equal(afterReassign.requests.find((row: any) => row.id === 'request-old').status, 'revoked')
  assert.equal(afterReassign.requests.find((row: any) => row.id === newId).contact.id, 'contact-new')
  assert.equal(afterReassign.requests.find((row: any) => row.id === newId).status, 'pending')

  await completeRequestsBulk([newId], new Date('2026-10-10T12:00:00.000Z'))
  setCacheValue(cacheKey, afterReassign)
  const afterComplete = await read()
  assert.equal(afterComplete.requests.find((row: any) => row.id === newId).status, 'completed')

  await resendRequestsBulk([newId], new Date('2026-10-10T13:00:00.000Z'))
  setCacheValue(cacheKey, afterComplete)
  const afterReopen = await read()
  const reopened = afterReopen.requests.find((row: any) => row.id === newId)
  assert.equal(reopened.status, 'pending')
  assert.equal(reopened.requestedAt, '2026-10-10T13:00:00.000Z')

  await revokeRequestsBulk([newId], new Date('2026-10-10T14:00:00.000Z'))
  setCacheValue(cacheKey, afterReopen)
  assert.equal((await read()).requests.find((row: any) => row.id === newId).status, 'revoked')

  setCacheValue(`project:contacts:${project.id}`, { contacts: [contacts[0]] })
  const contactResponse = await getContacts(new NextRequest(`http://localhost/api/projects/${project.id}/contacts`), params)
  assert.equal(contactResponse.headers.get('cache-control'), 'private, no-store')
  assert.deepEqual((await contactResponse.json()).contacts.map((contact: any) => contact.id), ['contact-old', 'contact-new'])
})
