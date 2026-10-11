import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth'
import { ApiError } from '@/lib/api-error'
import { GET as listMembers } from '@/app/api/organizations/[organizationId]/members/route'
import { POST as inviteMember } from '@/app/api/organizations/[organizationId]/invite/route'
import { PATCH as updateMember, DELETE as removeMember } from '@/app/api/organizations/[organizationId]/members/[membershipId]/route'
import { POST as acceptInvite } from '@/app/api/organizations/[organizationId]/members/[membershipId]/accept/route'
import { POST as declineInvite } from '@/app/api/organizations/[organizationId]/members/[membershipId]/decline/route'
import { GET as listOrganizations } from '@/app/api/organizations/route'
import { GET as currentOrganization } from '@/app/api/organizations/current/route'
import { restoreOrganization } from './restore'

// Query-aware mocks keep the real authorization and route logic in these tests.
function matches(record: any, where: any): boolean {
  return Object.entries(where ?? {}).every(([key, expected]: [string, any]) => {
    const actual = record[key]
    if (expected && typeof expected === 'object') {
      if ('not' in expected) return actual !== expected.not
      if ('in' in expected) return expected.in.includes(actual)
      return matches(actual, expected)
    }
    return actual === expected
  })
}

function setup(t: any, actorRole = 'OWNER', actorStatus = 'ACCEPTED') {
  const organization = {
    id: 'org-a', status: 'ACTIVE', deletedAt: null as Date | null,
    slug: 'test-org', displayName: 'Test organization', planCode: 'free',
    planAssignedAt: new Date(), planValidUntil: null,
    plan: { planCode: 'free', label: 'Free', maxActiveProjects: 1, maxEditors: 0, maxVerifiers: 0, maxViewers: null },
  }
  const rows: any[] = [
    { id: 'actor', userId: 'actor', organizationId: organization.id, role: actorRole, inviteStatus: actorStatus, organization },
    { id: 'owner', userId: 'owner', organizationId: organization.id, role: 'OWNER', inviteStatus: 'ACCEPTED', organization },
    { id: 'member', userId: 'member', organizationId: organization.id, role: 'VIEWER_READONLY', inviteStatus: 'ACCEPTED', organization },
    { id: 'pending', userId: 'invited', organizationId: organization.id, role: 'VIEWER_READONLY', inviteStatus: 'PENDING', organization, joinedAt: null },
  ]
  let writes = 0
  const stub = (target: any, method: string, implementation: (...args: any[]) => any) => {
    const original = target[method]
    target[method] = implementation
    t.after(() => { target[method] = original })
  }
  stub(prisma.organizationMembership, 'findFirst', async ({ where }: any) => rows.find(row => matches(row, where)) ?? null)
  stub(prisma.organizationMembership, 'findMany', async ({ where }: any) => rows.filter(row => matches(row, where)))
  stub(prisma.organizationMembership, 'findUnique', async ({ where }: any) => rows.find(row => matches(row, where.organizationId_userId)) ?? null)
  stub(prisma.organizationMembership, 'count', async ({ where }: any) => rows.filter(row => matches(row, where)).length)
  stub(prisma.organizationMembership, 'create', async ({ data }: any) => {
    writes++
    const row = { id: 'new-member', ...data, organization }
    rows.push(row)
    return row
  })
  stub(prisma.organizationMembership, 'update', async ({ where, data }: any) => {
    const row = rows.find(row => matches(row, where))
    assert.ok(row, 'Update must target an existing membership')
    writes++
    Object.assign(row, data)
    return row
  })
  stub(prisma.organizationMembership, 'updateMany', async ({ where, data }: any) => {
    const matched = rows.filter(row => matches(row, where))
    writes += matched.length
    matched.forEach(row => Object.assign(row, data))
    return { count: matched.length }
  })
  stub(prisma.organizationMembership, 'delete', async ({ where }: any) => {
    const index = rows.findIndex(row => matches(row, where))
    assert.ok(index >= 0)
    writes++
    return rows.splice(index, 1)[0]
  })
  stub(prisma.user, 'findUnique', async () => ({ id: 'new-user', email: 'new@example.test', name: 'New teammate' }))
  stub(prisma.organization, 'findUnique', async () => organization)
  stub(prisma.organization, 'update', async ({ data }: any) => {
    writes++
    Object.assign(organization, data)
    return organization
  })
  stub(prisma.organizationUsageSnapshot, 'findFirst', async () => ({ computedAt: new Date() }))
  stub(prisma.project, 'count', async () => 0)
  stub(prisma, '$transaction', async (work: any) => work(prisma))
  stub(prisma, '$queryRaw', async () => [])
  __setCurrentUserResolver(async () => ({ id: 'actor', emailVerified: true } as any))
  t.after(__resetCurrentUserResolver)
  t.mock.method(console, 'error', () => {})
  return { rows, organization, writes: () => writes }
}

const orgContext = () => ({ params: Promise.resolve({ organizationId: 'org-a' }) })
const memberContext = (membershipId: string, organizationId = 'org-a') => ({ params: Promise.resolve({ organizationId, membershipId }) })
const request = (method: string, body?: any) => new NextRequest('http://localhost/api/organizations/org-a', {
  method, headers: { 'content-type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}),
})

for (const role of ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER_VERIFIER', 'VIEWER_READONLY']) {
  test(`${role}: accepted member can list; only admin/owner can manage memberships`, async t => {
    const fixture = setup(t, role)
    const canManage = role === 'OWNER' || role === 'ADMIN'
    assert.equal((await listMembers(request('GET'), orgContext())).status, 200)
    assert.equal((await inviteMember(request('POST', { email: 'new@example.test', role: 'VIEWER_READONLY' }), orgContext())).status, canManage ? 201 : 403)
    assert.equal((await updateMember(request('PATCH', { role: 'ADMIN' }), memberContext('member'))).status, canManage ? 200 : 403)
    assert.equal((await removeMember(request('DELETE'), memberContext('member'))).status, canManage ? 204 : 403)
    assert.equal(fixture.writes(), canManage ? 3 : 0)
  })
}

for (const status of ['PENDING', 'DECLINED', 'REVOKED']) {
  test(`${status}: even an owner role has no organization access`, async t => {
    const fixture = setup(t, 'OWNER', status)
    assert.equal((await listMembers(request('GET'), orgContext())).status, 403)
    assert.equal((await inviteMember(request('POST', { email: 'new@example.test', role: 'ADMIN' }), orgContext())).status, 403)
    assert.equal((await updateMember(request('PATCH', { role: 'ADMIN' }), memberContext('member'))).status, 403)
    assert.equal((await removeMember(request('DELETE'), memberContext('member'))).status, 403)
    assert.equal(fixture.writes(), 0)
  })
}

test('owner protection and tenant scope apply to admin membership writes', async t => {
  const fixture = setup(t, 'ADMIN')
  assert.equal((await updateMember(request('PATCH', { role: 'VIEWER_READONLY' }), memberContext('owner'))).status, 403)
  assert.equal((await removeMember(request('DELETE'), memberContext('owner'))).status, 403)
  assert.equal((await updateMember(request('PATCH', { role: 'OWNER' }), memberContext('member'))).status, 400)
  assert.equal((await inviteMember(request('POST', { email: 'new@example.test', role: 'OWNER' }), orgContext())).status, 422)
  assert.equal((await updateMember(request('PATCH', { role: 'ADMIN' }), memberContext('member', 'org-b'))).status, 403)
  assert.equal((await removeMember(request('DELETE'), memberContext('member', 'org-b'))).status, 403)
  assert.equal(fixture.writes(), 0)
})

for (const [name, respond] of [['accept', acceptInvite], ['decline', declineInvite]] as const) {
  test(`${name}: invitation is scoped to organization, invited user and pending status`, async t => {
    const fixture = setup(t)
    assert.equal((await respond(request('POST'), memberContext('pending'))).status, 403)
    __setCurrentUserResolver(async () => ({ id: 'invited', emailVerified: true } as any))
    assert.equal((await respond(request('POST'), memberContext('pending', 'org-b'))).status, 404)
    assert.equal(fixture.writes(), 0)
    assert.equal((await respond(request('POST'), memberContext('pending'))).status, 200)
    assert.equal((await respond(request('POST'), memberContext('pending'))).status, 409)
    assert.equal(fixture.writes(), 1)
  })
}

test('a deleted organization blocks member reads and invite acceptance', async t => {
  const fixture = setup(t)
  fixture.organization.status = 'DELETED'
  assert.equal((await listMembers(request('GET'), orgContext())).status, 403)
  __setCurrentUserResolver(async () => ({ id: 'invited' } as any))
  assert.equal((await acceptInvite(request('POST'), memberContext('pending'))).status, 404)
  assert.equal(fixture.writes(), 0)
})

test('current organization returns actual actor role for read-only UI and checks requested tenant', async t => {
  setup(t, 'VIEWER_READONLY')
  const response = await currentOrganization(new NextRequest('http://localhost/api/organizations/current?organizationId=org-a'))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).organization.role, 'VIEWER_READONLY')
  assert.equal((await currentOrganization(new NextRequest('http://localhost/api/organizations/current?organizationId=org-b'))).status, 404)
})

test('pending invitation list exposes membership ID and excludes processed or deleted invites', async t => {
  const fixture = setup(t)
  for (const status of ['PENDING', 'DECLINED', 'REVOKED']) {
    fixture.rows.push({ id: `invite-${status}`, userId: 'actor', organizationId: `org-${status}`, role: 'VIEWER_READONLY', inviteStatus: status, organization: { ...fixture.organization, id: `org-${status}` } })
  }
  fixture.rows.push({ id: 'deleted-invite', userId: 'actor', organizationId: 'org-deleted', role: 'VIEWER_READONLY', inviteStatus: 'PENDING', organization: { ...fixture.organization, id: 'org-deleted', status: 'DELETED' } })
  const response = await listOrganizations(new NextRequest('http://localhost/api/organizations?includePending=true'))
  assert.equal(response.status, 200)
  const payload = await response.json()
  assert.deepEqual(payload.organizations.map((org: any) => [org.id, org.membership_id]), [['org-a', 'actor'], ['org-PENDING', 'invite-PENDING']])
  const acceptedOnly = await listOrganizations(new NextRequest('http://localhost/api/organizations'))
  assert.deepEqual((await acceptedOnly.json()).organizations.map((org: any) => org.id), ['org-a'])
})

test('free plan editor limit applies to invitations, role changes and acceptance', async t => {
  const fixture = setup(t)
  for (const response of [
    await inviteMember(request('POST', { email: 'new@example.test', role: 'EDITOR' }), orgContext()),
    await updateMember(request('PATCH', { role: 'EDITOR' }), memberContext('member')),
  ]) {
    assert.equal(response.status, 409)
    assert.equal((await response.json()).code, 'SEAT_LIMIT_EXCEEDED')
  }
  fixture.rows.find(row => row.id === 'pending').role = 'EDITOR'
  __setCurrentUserResolver(async () => ({ id: 'invited', emailVerified: true } as any))
  assert.equal((await acceptInvite(request('POST'), memberContext('pending'))).status, 409)
  assert.equal(fixture.writes(), 0)
})

test('unverified invitee cannot accept but can decline without changing existing access rules', async t => {
  const fixture = setup(t)
  __setCurrentUserResolver(async () => ({ id: 'invited', emailVerified: false } as any))
  const response = await acceptInvite(request('POST'), memberContext('pending'))
  assert.equal(response.status, 403)
  assert.equal((await response.json()).code, 'EMAIL_NOT_VERIFIED')
  assert.equal(fixture.writes(), 0)
  assert.equal(fixture.rows.find(row => row.id === 'pending').inviteStatus, 'PENDING')
  assert.equal((await declineInvite(request('POST'), memberContext('pending'))).status, 200)
})

for (const [name, respond] of [['accept', acceptInvite], ['decline', declineInvite]] as const) {
  test(`${name}: concurrent processing cannot overwrite the invitation's final state`, async t => {
    const fixture = setup(t)
    __setCurrentUserResolver(async () => ({ id: 'invited', emailVerified: true } as any))
    const original = prisma.organizationMembership.updateMany.bind(prisma.organizationMembership)
    ;(prisma.organizationMembership as any).updateMany = async (args: any) => {
      // A competing transaction has completed after the read, before our CAS.
      fixture.rows.find(row => row.id === 'pending').inviteStatus = name === 'accept' ? 'DECLINED' : 'ACCEPTED'
      return original(args)
    }
    const response = await respond(request('POST'), memberContext('pending'))
    assert.equal(response.status, 409)
    assert.equal((await response.json()).code, 'CONFLICT')
    assert.equal(fixture.writes(), 0)
    assert.equal(fixture.rows.find(row => row.id === 'pending').inviteStatus, name === 'accept' ? 'DECLINED' : 'ACCEPTED')
  })
}

test('accepted owner can restore own deleted organization within retention', async t => {
  const fixture = setup(t)
  fixture.organization.status = 'DELETED'
  fixture.organization.deletedAt = new Date()
  assert.deepEqual(await restoreOrganization({ organizationId: 'org-a', userId: 'actor' }), {
    organization_id: 'org-a', status: 'active',
  })
  assert.equal(fixture.organization.status, 'ACTIVE')
  assert.equal(fixture.organization.deletedAt, null)
})

for (const [role, inviteStatus] of [['ADMIN', 'ACCEPTED'], ['OWNER', 'PENDING'], ['OWNER', 'REVOKED']]) {
  test(`${role}/${inviteStatus}: cannot restore deleted organization`, async t => {
    const fixture = setup(t, role, inviteStatus)
    fixture.organization.status = 'DELETED'
    fixture.organization.deletedAt = new Date()
    await assert.rejects(() => restoreOrganization({ organizationId: 'org-a', userId: 'actor' }), (error: any) => error instanceof ApiError && error.status === 403)
    assert.equal(fixture.writes(), 0)
  })
}

test('owner cannot restore another organization or an expired deletion', async t => {
  const fixture = setup(t)
  fixture.organization.status = 'DELETED'
  fixture.organization.deletedAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
  await assert.rejects(() => restoreOrganization({ organizationId: 'org-b', userId: 'actor' }), (error: any) => error instanceof ApiError && error.status === 403)
  await assert.rejects(() => restoreOrganization({ organizationId: 'org-a', userId: 'actor' }), (error: any) => error instanceof ApiError && error.status === 410)
  assert.equal(fixture.writes(), 0)
})
