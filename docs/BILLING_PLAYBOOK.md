# Billing Playbook

_Last updated: 2025-11-13_

> Purpose: Define the forward-looking architecture and operational steps for evolving manual plan assignment (Free, Pro Beta) into a production billing system with history, expiries, usage sources, and external payment integration. This is a planning / specification document—no code changes occur here.

---
## Table of Contents
1. Goals & Non-Goals
2. Current State (Beta Manual Billing)
3. Target Architecture Overview
4. Data Model Evolution
5. Plan Lifecycle & State Machine
6. Usage Sources & Aggregation
7. Expiry Handling & Automated Downgrades
8. Webhooks & Event Stream (Future)
9. Upgrade Flow (Manual → Automated)
10. API Contracts (Present & Future)
11. UI/UX Surfaces & Feature Flags
12. Security & Compliance Considerations (Future Scope)
13. Operational Procedures (Runbooks)
14. Metrics & Monitoring
15. Open Questions & Risks
16. Roadmap Alignment & Phasing

---
## 1. Goals & Non-Goals
**Goals**:
- Support manual plan assignment with accurate limits enforcement.
- Track plan expiries (Pro Beta) and downgrade safely.
- Provide a clear path to introduce plan history & auditability.
- Define usage metrics needed for future metered billing decisions.
- Document upgrade intent logging (501 endpoint) to avoid rework later.

**Non-Goals (for this phase)**:
- Real payment processing, invoices, taxes, proration.
- Self-serve checkout or subscription management portal.
- Entitlement management beyond simple limits.
- Per-seat billing granularity.

---
## 2. Current State (Beta Manual Billing)
- `organizations.plan_code` references `plan_definitions.plan_code`.
- `plan_valid_until` tracks expiry for `pro_beta` only (nullable for `free`).
- Upgrade request: `POST /api/organizations/:id/plan/upgrade` returns `501` and logs intent (ticket/reference placeholder).
- Limits enforced at creation or state transitions (project active, role seat assignment).
- No historical audit of plan changes; overwriting `plan_code` loses context.
- `ensureDefaultPlans()` runs during every seed to guarantee `free` + `pro_beta` definitions exist prior to assigning plans.
- Seat limits are now enforced both when invites are sent *and* when invitees click `Accept`, preventing back-door overages.
- Owners can restore soft-deleted organizations within 30 days via `POST /api/organizations/:id/restore`; the scheduler now auto-refreshes usage snapshots, with the manual recompute endpoint reserved for support when instant verification is required.

---
## 3. Target Architecture Overview
Add a history table and formal events pipeline while preserving current inline model.
```
plan_definitions (catalog) ← organizations (current plan) ← organization_plan_assignments (history) ← billing_events (future)
```
Usage collected in snapshots drives potential metered billing.

---
## 4. Data Model Evolution
| Table | Purpose | Status |
|-------|---------|--------|
| `plan_definitions` | Catalog of plans & static limits | Exists |
| `organizations` | Current plan & expiry fields | Exists |
| `organization_plan_assignments` | Append-only history of plan changes | Future |
| `organization_usage_snapshots` | Aggregated usage counts over time | Exists |
| `billing_events` | Emitted events (upgrade, downgrade, expiry) | Future |

**Proposed `organization_plan_assignments` schema (future):**
```
id UUID PK
organization_id UUID FK organizations
plan_code TEXT FK plan_definitions
assigned_at timestamptz (when plan took effect)
valid_until timestamptz NULL (if expiring)
assigned_by_user_id UUID NULL (manual operations)
automated BOOLEAN DEFAULT false (true if system/downgrade job)
reason TEXT NULL ("expiry", "manual_upgrade", "downgrade")
```
Indices: (organization_id, assigned_at DESC)

---
## 5. Plan Lifecycle & State Machine
States (implicit in plan_code + valid_until):
- Active (within validity window or non-expiring)
- Expiring Soon (<=14 days to valid_until)
- Expired (valid_until < now) → trigger downgrade
- Downgraded (post-expiry transition completed)

Downgrade Action:
1. Detect expired `pro_beta` daily.
2. Set `plan_code='free'`, update `plan_assigned_at=NOW()`, clear `plan_valid_until`.
3. Emit `plan.expired` event (future) and queue notification.
4. Recalculate usage; if over Free limits, surface warning UI but do NOT auto-delete/auto-archive—user must resolve.

---
## 6. Usage Sources & Aggregation
Real-time counters (current implementation):
- Active projects: `projects WHERE status='active'`.
- Editor seats: accepted memberships with `role='EDITOR'`.
- Verifier seats: reserved (0 until flag).
- Viewers: counted but not limited (store for analysis).

Snapshots strategy:
- Event-driven scheduler automatically queues recompute jobs after project status changes, membership accept/decline, organization restore, and other usage-affecting mutations.
- Lazy refresh on Usage/API reads ensures stale snapshots (>5 min) are recomputed before data is returned.
- Nightly cron remains optional insurance but is no longer required for freshness.
- Every recompute inserts into `organization_usage_snapshots` for trend & future billing heuristics.

**On-demand recompute (support-only fallback)**: `POST /api/organizations/:id/usage/recompute` is still available when support needs to force an immediate refresh (e.g., after manual SQL edits) or when automation is unavailable. The API writes a new row and returns it to the UI.

Minimum fields in snapshots: `organization_id, computed_at, active_projects, active_editors, active_verifiers, active_viewers`.

---
## 7. Expiry Handling & Automated Downgrades
Job (daily, idempotent):
1. Query `organizations WHERE plan_valid_until < NOW() AND plan_code='pro_beta'`.
2. For each: execute downgrade steps (Section 5).
3. Record metrics (# downgraded, failures).
4. Notify owner/admin via in-app banner (email optional future).

Edge Cases:
- Already downgraded manually earlier → skip.
- Partial failure (e.g., DB transient) → retried next run.

---
## 8. Webhooks & Event Stream (Future)
Planned events:
- `plan.upgraded`
- `plan.downgraded`
- `plan.expired`
- `plan.limit_warning` (threshold >80% usage; might batch)

Delivery: Start with internal table `billing_events`, later push to external webhook subscriptions.
Retry: Exponential backoff, dead-letter store.
Security: HMAC signatures using per-webhook secret.

---
## 9. Upgrade Flow (Manual → Automated)
Phase 1 (Now): 501 endpoint logs intent only.
Phase 2: Store intents in `organization_plan_assignments` with `automated=false` & `reason='manual_upgrade_request'`.
Phase 3: Integrate payment provider → on successful payment, create new assignment row (`automated=true`, reason='paid_upgrade').
Phase 4: Self-serve downgrade (user action) & scheduled expiry downgrades share assignment logic.

---
## 10. API Contracts (Present & Future)
Current:
- `GET /api/plan-definitions` (list)
- `POST /api/organizations/:id/plan/upgrade` (501 placeholder)
- `POST /api/organizations/:id/usage/recompute` (support-only fallback; normal recomputes are scheduled automatically)
- `POST /api/organizations/:id/restore` (owner-only, enforces 30-day retention)
Future:
- `GET /api/organizations/:id/plan/history` → list assignment rows.
- `POST /api/organizations/:id/plan/downgrade` → manual downgrade (owner/admin).
- `GET /api/billing/events` → internal audit (admin).

Error Codes:
- `PLAN_LIMIT_EXCEEDED` (attempt to exceed active project limit)
- `SEAT_LIMIT_EXCEEDED` (attempt to exceed editor/verifier seats)
- `UPGRADE_NOT_IMPLEMENTED` (501 placeholder)

---
## 11. UI/UX Surfaces & Feature Flags
Flags:
| Flag | Purpose |
|------|---------|
| `billingUiEnabled` | Toggles plan cards & upgrade modal |
| `verifierRoleEnabled` | Enables non-read-only verifier operations |

UI Components:
- **Plan Cards**: label, limits, expiry badge.
- **Upgrade Modal**: collects `target_plan_code`, optional contact email, notes.
- **Expiry Banner**: appears <=14 days before `plan_valid_until`.
- **Over-limit Warnings**: after downgrade if usage exceeds Free limits (non-blocking).
- **Usage Snapshot Refresh**: automated scheduler + lazy read refresh keep counts current; UI surfaces the last computed timestamp and a hidden/support-only "Force refresh" action that hits the recompute endpoint if absolutely needed.
- **Restore Organization Banner**: visible to owners after deletion scheduling; primary CTA hits the restore endpoint and shows retention countdown.

Future Enhancement: Seat usage heatmap & historical project count trend.

---
## 12. Security & Compliance Considerations (Future Scope)
- Payment data segregation (handled by provider, not stored locally).
- Audit logs immutable (append-only plan assignments table).
- GDPR: Deleting organizations after retention ensures removal of billing events referencing them.

---
## 13. Operational Procedures (Runbooks)
Manual Plan Change (current):
```
UPDATE organizations
SET plan_code='pro_beta', plan_assigned_at=NOW(), plan_valid_until='2025-12-31'
WHERE id='...';
```
Downgrade (manual emergency):
```
UPDATE organizations
SET plan_code='free', plan_assigned_at=NOW(), plan_valid_until=NULL
WHERE id='...';
```
If over limit post-downgrade: notify user to archive/delete or request upgrade again.

Usage Snapshot Recompute (support path, optional):
1. Automation fires after every usage-affecting mutation and whenever the Usage tab/API detects a stale snapshot (>5 minutes). No action is required for normal restores, project changes, or seat updates.
2. If a customer explicitly asks for an immediate refresh or automation is temporarily unavailable, run the manual endpoint below.
```
curl -X POST https://app.carbonreport.io/api/organizations/{orgId}/usage/recompute \
	-H "Cookie: session=..." | jq
```
3. Confirm the response body shows the new `computed_at` timestamp and spot-check the Usage tab.

Organization Restore (within retention):
1. Confirm `deleted_at` < 30 days ago.
2. Owner (or support impersonating owner) calls `POST /api/organizations/{orgId}/restore`.
3. Usage metrics will refresh automatically within seconds; only run the manual recompute command if the customer needs proof-of-update immediately or automation is degraded.
4. Notify customer and remind them limits still apply (they may need to archive projects if they were over limit when deleted).

---
## 14. Metrics & Monitoring
Track:
- # upgrade intents per week
- Active vs archived project distributions per plan
- Seat usage ratio (used seats / max_editors)
- Downgrade events (count, timing)

Future Dashboards: plan churn, average time on Pro Beta, expansion attempts (upgrade intents that repeat within 30 days).

---
## 15. Open Questions & Risks
| Topic | Risk | Mitigation |
|-------|------|------------|
| No plan history | Loss of audit trail | Introduce assignments table before payments |
| Over-limit after downgrade | User blocked from restore accidentally | Non-blocking warnings; allow remediation |
| Expiry job failure | Stale Pro Beta plans | Idempotent daily job + alerting |
| Seat escalation patterns | Unknown future pricing leverage | Start collecting snapshots early |
| Manual SQL errors | Incorrect expiry settings | Provide verified scripts or admin UI |

---
## 16. Roadmap Alignment & Phasing
| Phase | Scope | Outcome |
|-------|-------|---------|
| 1 | Manual limits + upgrade intent logging | Baseline billing visibility |
| 2 | Plan history table + expiry job | Durable audit + automated downgrades |
| 3 | Webhook/event pipeline | External integrations & analytics |
| 4 | Payment provider integration | Real upgrades & self-service |
| 5 | Advanced metering | Potential usage-based pricing model |

Dependencies: multi-org model (completed), usage snapshot population (in progress), feature flags accessible via config.

---
**End of document**
