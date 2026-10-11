import assert from 'node:assert/strict'
import test, { afterEach, beforeEach } from 'node:test'
import { OrganizationMembershipInviteStatus, OrganizationMembershipRole } from '@prisma/client'
import { NextRequest } from 'next/server'
import {
  createTestContact,
  createTestMembership,
  createTestOrgWithOwner,
  createTestProject,
  createTestUser,
  ensureTestPlans,
} from '@/__tests__/factories'
import { cleanupTestData } from '@/__tests__/setup'
import prisma from '@/lib/db'
import * as auth from '@/lib/auth'
import { POST as remindDataRequests } from '@/app/api/data-requests/remind/route'
import { POST as reassignDataRequests } from '@/app/api/data-requests/reassign/route'
import { POST as createDataRequests } from '@/app/api/data-requests/bulk/route'
import { GET as listDataRequests } from '@/app/api/data-requests/route'
import { GET as listContacts } from '@/app/api/contacts/route'
import { GET as getContact } from '@/app/api/contacts/[id]/route'
import { GET as listProjectRequests } from '@/app/api/projects/[id]/data-requests/route'
import { GET as listProjectContacts } from '@/app/api/projects/[id]/contacts/route'
import { getContactsOverview, getContactDetail } from '@/lib/server-data/contacts'
import { getGlobalDataRequests, getProjectsForRequests } from '@/lib/server-data/requests'
import { getProjectContacts, getProjectDataRequests } from '@/lib/server-data/projects'
import { clearCache } from '@/lib/cache'

beforeEach(async () => {
  clearCache()
  await cleanupTestData()
  await ensureTestPlans()
})

afterEach(async () => {
  clearCache()
  await cleanupTestData()
  auth.__resetCurrentUserResolver()
})

function mockUser(userId: string) {
  auth.__setCurrentUserResolver(async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  })
}

function buildJsonRequest(path: string, body: Record<string, unknown>) {
  return new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

async function createPendingDataRequest() {
  const { org, user } = await createTestOrgWithOwner({ planCode: 'pro_beta' })
  const project = await createTestProject({
    organizationId: org.id,
    createdByUserId: user.id,
  })
  const contact = await createTestContact({
    organizationId: org.id,
    createdByUserId: user.id,
    name: 'Supplier Contact',
    email: 'supplier@example.com',
  })

  const request = await prisma.dataRequest.create({
    data: {
      userId: user.id,
      projectId: project.id,
      contactId: contact.id,
      dataPointId: 'supplier_energy_mwh',
      fieldLabel: 'Supplier energy',
      requestedAt: new Date('2026-06-01T00:00:00.000Z'),
      deadline: new Date('2026-06-30T00:00:00.000Z'),
    },
  })

  return { org, user, project, contact, request }
}

test('POST /api/data-requests/remind: updates requestedAt for authorized editor', async () => {
  const { user, request } = await createPendingDataRequest()
  mockUser(user.id)

  const response = await remindDataRequests(
    buildJsonRequest('/api/data-requests/remind', {
      ids: [request.id],
      requestedAt: '2026-06-16T10:00:00.000Z',
    }),
  )

  const payload = (await response.json()) as {
    success?: boolean
    updated?: number
    requests?: Array<{ id: string; requestedAt: string; status: string }>
  }

  assert.equal(response.status, 200)
  assert.equal(payload.success, true)
  assert.equal(payload.updated, 1)
  assert.equal(payload.requests?.[0]?.id, request.id)
  assert.equal(payload.requests?.[0]?.status, 'pending')
  assert.equal(payload.requests?.[0]?.requestedAt, '2026-06-16T10:00:00.000Z')
})

test('POST /api/data-requests/remind: rejects user without project membership', async () => {
  const { request } = await createPendingDataRequest()
  const outsider = await createTestUser()
  mockUser(outsider.id)

  const response = await remindDataRequests(
    buildJsonRequest('/api/data-requests/remind', {
      ids: [request.id],
      requestedAt: '2026-06-16T10:00:00.000Z',
    }),
  )

  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 403)
  assert.equal(payload.code, 'FORBIDDEN')
})

test('POST /api/data-requests/remind: allows accepted editor membership', async () => {
  const { org, request } = await createPendingDataRequest()
  const editor = await createTestUser()
  await createTestMembership({
    organizationId: org.id,
    userId: editor.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })
  mockUser(editor.id)

  const response = await remindDataRequests(
    buildJsonRequest('/api/data-requests/remind', {
      ids: [request.id],
      requestedAt: '2026-06-17T10:00:00.000Z',
    }),
  )

  const payload = (await response.json()) as { success?: boolean; updated?: number }

  assert.equal(response.status, 200)
  assert.equal(payload.success, true)
  assert.equal(payload.updated, 1)
})

test('POST /api/data-requests/reassign: revokes old pending request and creates a new one for target contact', async () => {
  const { org, user, request } = await createPendingDataRequest()
  mockUser(user.id)

  const targetContact = await createTestContact({
    organizationId: org.id,
    createdByUserId: user.id,
    name: 'New Supplier Contact',
    email: 'new-supplier@example.com',
  })

  const response = await reassignDataRequests(
    buildJsonRequest('/api/data-requests/reassign', {
      ids: [request.id],
      contact: {
        id: targetContact.id,
        email: targetContact.email,
        name: targetContact.name,
      },
      reassignedAt: '2026-06-18T10:00:00.000Z',
    }),
  )

  const payload = (await response.json()) as {
    success?: boolean
    revoked?: number
    created?: number
    requests?: Array<{ id: string; status: string; contact?: { id?: string | null } | null }>
  }

  const oldRequest = await prisma.dataRequest.findUniqueOrThrow({ where: { id: request.id } })

  assert.equal(response.status, 200)
  assert.equal(payload.success, true)
  assert.equal(payload.revoked, 1)
  assert.equal(payload.created, 1)
  assert.equal(payload.requests?.length, 1)
  assert.notEqual(payload.requests?.[0]?.id, request.id)
  assert.equal(payload.requests?.[0]?.status, 'pending')
  assert.equal(payload.requests?.[0]?.contact?.id, targetContact.id)
  assert.equal(oldRequest.revokedAt?.toISOString(), '2026-06-18T10:00:00.000Z')
})

test('POST /api/data-requests/reassign: rejects user without project membership', async () => {
  const { org, user, request } = await createPendingDataRequest()
  const outsider = await createTestUser()
  const targetContact = await createTestContact({
    organizationId: org.id,
    createdByUserId: user.id,
  })
  mockUser(outsider.id)

  const response = await reassignDataRequests(
    buildJsonRequest('/api/data-requests/reassign', {
      ids: [request.id],
      contact: {
        id: targetContact.id,
        email: targetContact.email,
        name: targetContact.name,
      },
    }),
  )

  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 403)
  assert.equal(payload.code, 'FORBIDDEN')
})

test('POST /api/data-requests/reassign: rejects completed requests', async () => {
  const { org, user, request } = await createPendingDataRequest()
  const targetContact = await createTestContact({
    organizationId: org.id,
    createdByUserId: user.id,
  })
  mockUser(user.id)

  await prisma.dataRequest.update({
    where: { id: request.id },
    data: { completedAt: new Date('2026-06-10T00:00:00.000Z') },
  })

  const response = await reassignDataRequests(
    buildJsonRequest('/api/data-requests/reassign', {
      ids: [request.id],
      contact: {
        id: targetContact.id,
        email: targetContact.email,
        name: targetContact.name,
      },
    }),
  )

  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 409)
  assert.equal(payload.code, 'CONFLICT')
})

test('POST /api/data-requests/bulk: persists the chosen deadline and authenticated editor', async () => {
  const { org, project, contact } = await createPendingDataRequest()
  const editor = await createTestUser()
  await createTestMembership({ organizationId: org.id, userId: editor.id, role: OrganizationMembershipRole.EDITOR })
  mockUser(editor.id)

  const response = await createDataRequests(buildJsonRequest('/api/data-requests/bulk', {
    projectId: project.id,
    contact: { id: contact.id, email: contact.email },
    deadline: '2026-10-20',
    fields: [{ dataPointId: 'supplier_energy_mwh', fieldLabel: 'Supplier energy' }],
    mailtoPreview: { subject: 'QA request', body: 'Please provide supplier energy.' },
  }))
  const payload = await response.json()
  assert.equal(response.status, 201)
  const saved = await prisma.dataRequest.findUniqueOrThrow({ where: { id: payload.requests[0].id } })
  assert.equal(saved.userId, editor.id)
  assert.equal(saved.deadline?.toISOString(), '2026-10-20T00:00:00.000Z')
  assert.equal(payload.requests[0].deadline, '2026-10-20T00:00:00.000Z')
  const listed = await listProjectRequests(new NextRequest(`http://localhost/api/projects/${project.id}/data-requests?status=all`), {
    params: Promise.resolve({ id: project.id }),
  })
  const list = await listed.json()
  assert.equal(list.requests.find((row: { id: string }) => row.id === saved.id)?.deadline, '2026-10-20T00:00:00.000Z')
})

test('POST /api/data-requests/bulk: denies outsiders, viewers and pending editors without writing', async () => {
  const { org, project, contact, request } = await createPendingDataRequest()
  const outsider = await createTestUser()
  const viewer = await createTestUser()
  const pendingEditor = await createTestUser()
  await createTestMembership({ organizationId: org.id, userId: viewer.id, role: OrganizationMembershipRole.VIEWER_READONLY })
  await createTestMembership({
    organizationId: org.id, userId: pendingEditor.id, role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.PENDING,
  })
  for (const user of [outsider, viewer, pendingEditor]) {
    mockUser(user.id)
    const response = await createDataRequests(buildJsonRequest('/api/data-requests/bulk', {
      projectId: project.id,
      contact: { id: contact.id, email: contact.email },
      fields: [{ dataPointId: 'supplier_energy_mwh' }],
      mailtoPreview: { subject: 'QA request', body: 'Please provide supplier energy.' },
    }))
    assert.equal(response.status, 403)
  }
  assert.equal(await prisma.dataRequest.count({ where: { projectId: project.id } }), 1)
  assert.equal((await prisma.dataRequest.findUniqueOrThrow({ where: { id: request.id } })).revokedAt, null)
})

test('contacts and requests: cross-organization reads and cached direct project URLs stay isolated', async () => {
  const own = await createPendingDataRequest()
  const other = await createPendingDataRequest()
  const directRequest = (id: string) => new NextRequest(`http://localhost/api/projects/${id}/data-requests?status=all`)

  // Prime caches as the legitimate owner before trying the same IDs as another tenant.
  mockUser(other.user.id)
  assert.equal((await listProjectRequests(directRequest(other.project.id), { params: Promise.resolve({ id: other.project.id }) })).status, 200)
  assert.equal((await listProjectContacts(directRequest(other.project.id), { params: Promise.resolve({ id: other.project.id }) })).status, 200)
  mockUser(own.user.id)

  assert.deepEqual((await getContactsOverview()).map((row) => row.id), [own.contact.id])
  assert.deepEqual((await getGlobalDataRequests({})).map((row) => row.id), [own.request.id])
  assert.deepEqual((await getProjectsForRequests()).map((row) => row.id), [own.project.id])
  assert.equal(await getContactDetail(other.contact.id), null)
  assert.deepEqual(await getProjectContacts(other.project.id), [])
  assert.deepEqual(await getProjectDataRequests(other.project.id), [])

  assert.deepEqual((await (await listContacts()).json()).contacts.map((row: { id: string }) => row.id), [own.contact.id])
  for (const query of [`projectId=${other.project.id}`, `contactId=${other.contact.id}`]) {
    const response = await listDataRequests(new NextRequest(`http://localhost/api/data-requests?${query}`))
    assert.equal(response.status, 200)
    assert.deepEqual((await response.json()).requests, [])
  }
  assert.equal((await getContact(new Request('http://localhost'), { params: Promise.resolve({ id: other.contact.id }) })).status, 404)
  assert.equal((await listProjectRequests(directRequest(other.project.id), { params: Promise.resolve({ id: other.project.id }) })).status, 404)
  assert.equal((await listProjectContacts(directRequest(other.project.id), { params: Promise.resolve({ id: other.project.id }) })).status, 404)
})
