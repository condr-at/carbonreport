import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth'
import { ApiError } from '@/lib/api-error'
import { clearCache } from '@/lib/cache'
import { getContactsOverview, getContactDetail } from './contacts'
import { getGlobalDataRequests, getProjectsForRequests } from './requests'
import { getProjectContacts, getProjectDataRequests, getProjectSummary, getProjectSummaryCached, getProjectDataset } from './projects'
import { GET as listContacts } from '@/app/api/contacts/route'
import { GET as contactDetail } from '@/app/api/contacts/[id]/route'
import { GET as listRequests } from '@/app/api/data-requests/route'
import { GET as projectContacts } from '@/app/api/projects/[id]/contacts/route'
import { GET as projectRequests } from '@/app/api/projects/[id]/data-requests/route'

// Small in-memory query boundary: an omitted tenant predicate returns other tenants too.
function matches(record: any, where: any): boolean {
  return Object.entries(where ?? {}).every(([key, expected]: [string, any]) => {
    const actual = record[key]
    if (expected && typeof expected === 'object') {
      if ('in' in expected) return expected.in.includes(actual)
      if ('not' in expected) return actual !== expected.not
      return matches(actual, expected)
    }
    return actual === expected
  })
}

test('contact and request reads isolate accepted organization memberships across SSR and APIs', async (t) => {
  const date = new Date('2026-10-10T10:00:00.000Z')
  const memberships = [
    { userId: 'user-a', organizationId: 'org-a', inviteStatus: 'ACCEPTED', organization: { status: 'ACTIVE' } },
    { userId: 'user-b', organizationId: 'org-b', inviteStatus: 'ACCEPTED', organization: { status: 'ACTIVE' } },
    { userId: 'user-a', organizationId: 'org-pending', inviteStatus: 'PENDING', organization: { status: 'ACTIVE' } },
    { userId: 'user-a', organizationId: 'org-deleted', inviteStatus: 'ACCEPTED', organization: { status: 'DELETED' } },
  ]
  const contacts = memberships.map((membership) => ({
    id: `contact-${membership.organizationId}`,
    organizationId: membership.organizationId,
    name: membership.organizationId,
    email: `${membership.organizationId}@example.test`,
    archived: false, position: null, createdAt: date, updatedAt: date,
  }))
  const projects = memberships.map((membership) => ({
    id: `project-${membership.organizationId}`,
    organizationId: membership.organizationId,
    name: membership.organizationId,
    deletedAt: null,
    status: 'ACTIVE', projectType: 'PRODUCT', createdAt: date, datasetVersion: 1,
    dataset: { data_points: [{ field_id: 'product_name', value: membership.organizationId }] },
    createdBy: { name: membership.userId },
  }))
  const requests = projects.map((project, index) => ({
    id: `request-${project.organizationId}`,
    projectId: project.id, project,
    contactId: contacts[index].id, contact: contacts[index],
    requestedAt: date, completedAt: null, revokedAt: null, deadline: null,
    dataPointId: 'supplier_energy_mwh', fieldLabel: 'Supplier energy', itemId: null,
  }))
  const stub = (target: any, method: string, implementation: (...args: any[]) => any) => {
    const original = target[method]
    target[method] = implementation
    t.after(() => { target[method] = original })
  }
  stub(prisma.organizationMembership, 'findMany', async ({ where }: any) => memberships.filter((row) => matches(row, where)))
  stub(prisma.contact, 'findMany', async ({ where }: any) => contacts.filter((row) => matches(row, where)))
  stub(prisma.contact, 'findFirst', async ({ where }: any) => contacts.find((row) => matches(row, where)) ?? null)
  stub(prisma.contact, 'findUnique', async ({ where }: any) => contacts.find((row) => matches(row, where)) ?? null)
  stub(prisma.project, 'findMany', async ({ where }: any) => projects.filter((row) => matches(row, where)))
  stub(prisma.project, 'findFirst', async ({ where }: any) => projects.find((row) => matches(row, where)) ?? null)
  stub(prisma.project, 'findUnique', async ({ where }: any) => projects.find((row) => matches(row, where)) ?? null)
  stub(prisma.dataRequest, 'findMany', async ({ where }: any) => requests.filter((row) => matches(row, where)))
  stub(prisma.datasetFieldDefinition, 'findMany', async () => [])
  t.mock.method(console, 'error', () => {})
  __setCurrentUserResolver(async () => ({ id: 'user-a' } as any))
  t.after(__resetCurrentUserResolver)
  clearCache()
  t.after(clearCache)

  await t.test('project SSR summary and dataset exclude other tenants and invalid memberships', async () => {
    assert.equal((await getProjectSummary('project-org-a'))?.name, 'org-a')
    assert.equal((await getProjectDataset('project-org-a'))?.dataset?.data_points[0].value, 'org-a')
    for (const id of ['project-org-b', 'project-org-pending', 'project-org-deleted', 'missing']) {
      assert.equal(await getProjectSummaryCached(id), null, id)
      assert.equal(await getProjectDataset(id), null, id)
    }
    projects[0].deletedAt = date as any
    assert.equal(await getProjectSummary('project-org-a'), null)
    assert.equal(await getProjectDataset('project-org-a'), null)
    projects[0].deletedAt = null
    __setCurrentUserResolver(async () => ({ id: 'user-b' } as any))
    assert.equal(await getProjectSummaryCached('project-org-a'), null)
    assert.equal(await getProjectDataset('project-org-a'), null)
    assert.equal((await getProjectSummaryCached('project-org-b'))?.name, 'org-b')
    __setCurrentUserResolver(async () => ({ id: 'user-a' } as any))
  })

  await t.test('page hydration excludes other, pending and deleted organizations', async () => {
    assert.deepEqual((await getContactsOverview()).map((row) => row.id), ['contact-org-a'])
    assert.deepEqual((await getGlobalDataRequests({})).map((row) => row.id), ['request-org-a'])
    assert.deepEqual((await getProjectsForRequests()).map((row) => row.id), ['project-org-a'])
    assert.equal((await getContactDetail('contact-org-a'))?.totalRequests, 1)
    assert.equal(await getContactDetail('contact-org-b'), null)
    assert.deepEqual((await getProjectDataRequests('project-org-a')).map((row) => row.id), ['request-org-a'])
    assert.deepEqual(await getProjectDataRequests('project-org-b'), [])
  })

  await t.test('API lists and explicit outsider filters cannot bypass scope', async () => {
    const contactsResponse = await listContacts()
    assert.equal(contactsResponse.status, 200)
    assert.deepEqual((await contactsResponse.json()).contacts.map((row: any) => row.id), ['contact-org-a'])
    const requestsResponse = await listRequests(new NextRequest('http://localhost/api/data-requests'))
    assert.equal(requestsResponse.status, 200)
    assert.deepEqual((await requestsResponse.json()).requests.map((row: any) => row.id), ['request-org-a'])
    for (const query of ['projectId=project-org-b', 'contactId=contact-org-b']) {
      const response = await listRequests(new NextRequest(`http://localhost/api/data-requests?${query}`))
      assert.equal(response.status, 200)
      assert.deepEqual((await response.json()).requests, [])
    }
    const outsider = await contactDetail(new Request('http://localhost'), { params: Promise.resolve({ id: 'contact-org-b' }) })
    assert.equal(outsider.status, 404)
    const own = await contactDetail(new Request('http://localhost'), { params: Promise.resolve({ id: 'contact-org-a' }) })
    assert.equal(own.status, 200)
    assert.deepEqual((await own.json()).requests.map((row: any) => row.id), ['request-org-a'])
  })

  await t.test('project contact picker checks access before returning or caching contacts', async () => {
    assert.deepEqual((await getProjectContacts('project-org-a')).map((row) => row.id), ['contact-org-a'])
    assert.deepEqual(await getProjectContacts('project-org-b'), [])
    const own = await projectContacts(new NextRequest('http://localhost'), { params: Promise.resolve({ id: 'project-org-a' }) })
    assert.equal(own.status, 200)
    assert.deepEqual((await own.json()).contacts.map((row: any) => row.id), ['contact-org-a'])
    const ownRequests = await projectRequests(new NextRequest('http://localhost'), { params: Promise.resolve({ id: 'project-org-a' }) })
    assert.equal(ownRequests.status, 200)
    assert.deepEqual((await ownRequests.json()).requests.map((row: any) => row.id), ['request-org-a'])
    __setCurrentUserResolver(async () => ({ id: 'user-b' } as any))
    const cachedOutsider = await projectContacts(new NextRequest('http://localhost'), { params: Promise.resolve({ id: 'project-org-a' }) })
    assert.equal(cachedOutsider.status, 404)
    const cachedRequests = await projectRequests(new NextRequest('http://localhost'), { params: Promise.resolve({ id: 'project-org-a' }) })
    assert.equal(cachedRequests.status, 404)
    __setCurrentUserResolver(async () => ({ id: 'user-a' } as any))
  })

  await t.test('users without memberships see empty lists and unauthenticated requests return 401', async () => {
    __setCurrentUserResolver(async () => ({ id: 'no-memberships' } as any))
    assert.deepEqual(await getContactsOverview(), [])
    assert.deepEqual(await getGlobalDataRequests({}), [])
    assert.deepEqual(await getProjectsForRequests(), [])
    assert.equal(await getProjectSummary('project-org-a'), null)
    assert.equal(await getProjectDataset('project-org-a'), null)
    __setCurrentUserResolver(async () => { throw new ApiError(401, 'UNAUTHORIZED', 'Not authenticated') })
    assert.equal((await listContacts()).status, 401)
    assert.equal((await listRequests(new NextRequest('http://localhost/api/data-requests'))).status, 401)
    assert.equal((await contactDetail(new Request('http://localhost'), { params: Promise.resolve({ id: 'contact-org-a' }) })).status, 401)
  })
})
