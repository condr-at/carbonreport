# Multi-Org Implementation Status

_Last updated: 2025-11-16_

Quick reference for current implementation state of the multi-organization architecture.

---

## 🎯 Overall Status: **85% Complete** 🟡

**Staging Ready**: ✅ YES  
**Production Ready**: ❌ NO (test coverage blocker)

---

## ✅ Completed (100%)

### Backend Core
- ✅ **Database Schema** — All tables, enums, indices per ARCHITECTURE.md
- ✅ **Migrations & Seed** — Plans (free, pro_beta), demo orgs, users, memberships
- ✅ **Server Guards** — assertOrgMembership, assertWithinLimit, getPlan, getOrganizationUsage
- ✅ **Error Handling** — Unified `{ error, code, details }` format across all APIs

### APIs (Complete Coverage)
- ✅ **Organizations API** — CRUD, members, invite, usage, restore, plan/upgrade stub
- ✅ **Projects API** — Lifecycle (status, delete, restore), limit enforcement
- ✅ **Dataset API** — Optimistic locking (datasetVersion), VERSION_CONFLICT handling
- ✅ **Uploads API** — Signed URLs, MIME/size validation (413/415), asset tracking

### Frontend
- ✅ **Organization Switcher** — Plan pill, usage counter, empty/loading/error states
- ✅ **Settings UI** — Profile, Members, Usage, Billing, Danger Zone tabs
- ✅ **Dataset Optimistic Locking** — UI handles VERSION_CONFLICT with refetch
- ✅ **Project Lifecycle UI** — Archive, restore, delete actions

### Documentation
- ✅ **ARCHITECTURE.md** — Complete multi-org model specification
- ✅ **API_REFERENCE.md** — All endpoints documented with error codes
- ✅ **UX_GUIDE.md** — Settings flows, switcher patterns
- ✅ **DEVELOPMENT.md** — Migrations, seed, test plan
- ✅ **BILLING_PLAYBOOK.md** — Plan expiry handling, future billing strategy

---

## 🟡 In Progress (90%)

### UI Polish
- ✅ Core functionality working
- ❌ **Expiry warning** — Visual indicator when `plan_valid_until <= 14 days`
- ❌ **Restore error UX** — Actionable suggestions on PLAN_LIMIT_EXCEEDED
- ❌ **Retention countdown** — Badge for deleted projects ("Expires in X days")

**Estimate**: ~4 hours to complete

---

## 🔴 Critical Gaps (15%)

### Test Coverage
**Current**: 3 test files only
- ✅ `service.test.ts` — Data requests (unit)
- ✅ `uploads/sign/route.test.ts` — Upload validation (unit)
- ✅ `uploads/relay/route.test.ts` — Local uploads (unit)

**Missing** (production blockers):
- ❌ Integration tests:
  - Create org with plan=free
  - Invite editor → SEAT_LIMIT_EXCEEDED
  - Delete org → cascade soft-delete
  - Restore project → PLAN_LIMIT_EXCEEDED/RETENTION_EXPIRED
- ❌ Unit tests:
  - Guards (assertWithinLimit, assertOrgMembership)
  - Usage calculations
  - Retention checks
- ❌ E2E tests:
  - Switcher context changes
  - Expiry warnings
  - VERSION_CONFLICT handling

**Estimate**: 1-2 days to unblock production

### Authentication
- 🔴 **Dev stub active** — Auto-creates users, bypasses real auth
- ⚠️ **Production blocker** — Must implement JWT middleware before deploy

**Estimate**: TBD (requires scoping)

---

## 📋 Verification Checklist

### Schema & Data
- [x] All tables exist with correct enums
- [x] Indices match ARCHITECTURE.md requirements
- [x] Seed creates Free + Pro Beta plans
- [x] Demo orgs and memberships created

### API Contracts
- [x] All endpoints return unified error format
- [x] PLAN_LIMIT_EXCEEDED returns `{ limit, current, needed }`
- [x] SEAT_LIMIT_EXCEEDED returns `{ role, limit, current }`
- [x] RETENTION_EXPIRED returns `{ deleted_at, window_days }`
- [x] VERSION_CONFLICT returns `{ expectedVersion, currentVersion }`

### Guards & Limits
- [x] assertOrgMembership enforces role hierarchy
- [x] assertWithinLimit checks project/editor/verifier
- [x] getPlan merges plan_definitions + valid_until
- [x] getOrganizationUsage counts all resource types

### Frontend Integration
- [x] Switcher shows plan + usage
- [x] Settings tabs functional
- [x] Dataset VERSION_CONFLICT triggers refetch
- [x] Restore/delete/archive work with limit checks
- [ ] Expiry warnings visible (<14 days)
- [ ] Limit exceeded errors show suggestions
- [ ] Retention countdown displayed

### Feature Flags
- [x] verifierRoleEnabled=false (guards active)
- [x] billingUiEnabled=true (UI shows plans)
- [x] approvalsEnabled=false (reserved)

---

## 🎯 Next Actions

### Priority 1: Unblock Production (1-2 days)
1. **Integration Tests**
   - Org creation + plan assignment
   - Limit enforcement (PLAN/SEAT_LIMIT_EXCEEDED)
   - Soft-delete cascade
   - Restore scenarios (limits + retention)

2. **Unit Tests**
   - Guards coverage >80%
   - Usage calculations
   - Retention logic

3. **E2E Tests**
   - Critical user flows (switcher, restore, optimistic locking)

### Priority 2: UI Polish (~4 hours)
1. Expiry warning badge in switcher
2. Restore error with upgrade/archive suggestions
3. Retention countdown for deleted projects

### Priority 3: Authentication (TBD)
1. Scope JWT middleware requirements
2. Replace dev stub
3. Test auth flows

---

## 📊 Epic Status Summary

| Epic | Status | Notes |
|------|--------|-------|
| Schema & Migrations | ✅ 100% | Complete |
| Server Guards | ✅ 100% | Complete |
| Organizations API | ✅ 100% | Complete |
| Projects API | ✅ 100% | Complete |
| Dataset API | ✅ 100% | Complete |
| Uploads API | ✅ 100% | Complete |
| Settings UI | ✅ 100% | Complete |
| Org Switcher | ✅ 100% | Complete |
| Memberships & Roles | ✅ 100% | Complete |
| Usage & Limits | ✅ 100% | Complete |
| Error Handling | ✅ 100% | Complete |
| Documentation | ✅ 100% | Complete |
| **UI Polish** | 🟡 **90%** | Minor gaps |
| **Testing** | 🔴 **15%** | **Critical** |

---

## 🚀 Deployment Readiness

### Staging Environment
**Status**: ✅ **READY**

Requirements met:
- All backend APIs functional
- Database schema complete
- Error handling consistent
- UI core workflows working

Safe to deploy for:
- Internal testing
- Stakeholder demos
- QA validation

### Production Environment
**Status**: ❌ **BLOCKED**

Blockers:
1. 🔴 Test coverage <20% (need >80%)
2. 🔴 Authentication using dev stub
3. 🟡 UI polish gaps (non-critical)

Do not deploy to production until:
- Integration test suite passes
- E2E tests cover critical flows
- Authentication middleware implemented
- Manual QA sign-off on limit scenarios

---

## 📞 Questions or Issues?

- Architecture: See `docs/ARCHITECTURE.md`
- API contracts: See `docs/API_REFERENCE.md`
- Dev setup: See `docs/DEVELOPMENT.md`
- Outstanding work: See `docs/planning/BACKLOG.md`

**Last verified**: 2025-11-16  
**Next review**: After test implementation
