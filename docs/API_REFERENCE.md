# API Reference

**Version**: 0.0.1  
**Last Updated**: November 12, 2025  
**Base URL**: `/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Organizations](#organizations)
  - [Create Organization](#create-organization)
  - [List Organizations](#list-organizations)
  - [Get Current Organization](#get-current-organization)
  - [Update Organization](#update-organization)
  - [Delete Organization](#delete-organization)
  - [Restore Organization](#restore-organization)
4. [Organization Plans](#organization-plans)
  - [List Plan Definitions](#list-plan-definitions)
  - [Request Plan Upgrade](#request-plan-upgrade)
## Authentication

The platform uses email/password auth backed by stateless JWTs stored in httpOnly cookies (`cr_access_token`, `cr_refresh_token`). Authentication is enforced centrally by `middleware.ts`, which verifies the access token on every request and injects `x-user-id` so API routes can trust `getCurrentUser()`.

- **Access token**: 24h TTL, minted on login/register/refresh. Stored in an httpOnly, SameSite=Lax cookie and never exposed to JS.
- **Refresh token**: 90d TTL, also httpOnly. `/api/auth/refresh` rotates both tokens and invalidates previous cookies.
- **Password policy**: ≥8 characters and must include uppercase, lowercase, and numeric characters. Passwords are hashed with bcrypt (12 rounds) before persistence.
- **Error format**: Failures reuse the unified `{ "error": string, "code": string, "details"?: object }` envelope described in [Common Error Codes](#common-error-codes).

### Endpoint Quick Reference

| Method | Path | Purpose | Auth? | Notes |
|--------|------|---------|-------|-------|
| `POST` | `/api/auth/register` | Create a user, send verification email, issue cookies | No | Lower-cases email, splits `name` into first/last |
| `POST` | `/api/auth/login` | Exchange credentials for cookies | No | Returns same `user` payload as register |
| `POST` | `/api/auth/logout` | Clear cookies | Yes (middleware enforced) | Idempotent |
| `POST` | `/api/auth/refresh` | Rotate cookies using refresh token | No (cookie-based) | Requires valid `cr_refresh_token` cookie |
| `GET` | `/api/auth/verify-email/:token` | Flip `emailVerified` and redirect/return JSON | No | Honors `Accept: application/json` |
| `POST` | `/api/auth/resend-verification` | Send another verification email | Yes | Skips work if already verified |
| `POST` | `/api/auth/forgot-password` | Send reset link if email exists | No | Always returns generic message |
| `POST` | `/api/auth/reset-password/:token` | Set a new password via token | No | Token invalidated when password changes |

### POST /api/auth/register — Create account

**Auth**: None (public). Creates the user row, hashes the password, and issues both cookies. A verification email is queued through Resend with a link to `/api/auth/verify-email/:token`.

**Request Body**
- `name`: 2–120 characters after trim. Stored verbatim and also split into `first_name` / `last_name` for downstream features.
- `email`: Valid email address. Address is lower-cased before persistence to guarantee uniqueness.
- `password`: Must satisfy the password policy listed above.

**Response — 201 Created**
```json
{
  "user": {
    "id": "uuid",
    "email": "jane@example.com",
    "name": "Jane Smith",
    "email_verified": false
  }
}
```

**Common errors**
- `400 VALIDATION_ERROR` — malformed payload or password fails policy (details include flattened Zod issues or `requirements`).
- `409 CONFLICT` — email already registered (case-insensitive match).

### POST /api/auth/login — Authenticate existing user

**Auth**: None (public). Looks up the user by lower-cased email, verifies the bcrypt hash, then issues fresh cookies.

**Request Body**
- `email`: Valid email address.
- `password`: Plain-text password; empty strings are rejected.

**Response — 200 OK**
```json
{
  "user": {
    "id": "uuid",
    "email": "jane@example.com",
    "name": "Jane Smith",
    "email_verified": true
  }
}
```

**Common errors**
- `400 VALIDATION_ERROR` — email/password missing or malformed.
- `401 UNAUTHORIZED` — user not found, deleted, or password mismatch (generic message to avoid leaking which field failed).

### POST /api/auth/logout — Clear cookies

**Auth**: Required (middleware). No request body. Always responds with `{ "success": true }` while setting both auth cookies to expired values, making the operation idempotent.

### POST /api/auth/refresh — Rotate session

**Auth**: Cookie-based. Reads `cr_refresh_token`, verifies the JWT, fetches the associated user, and issues brand-new cookies so long-lived sessions remain valid.

**Response — 200 OK**
```json
{
  "user": {
    "id": "uuid",
    "email": "jane@example.com",
    "name": "Jane Smith",
    "email_verified": true
  }
}
```

**Common errors**
- `401 UNAUTHORIZED` — refresh cookie missing/expired/invalid or user has been deleted.

### GET /api/auth/verify-email/:token — Complete verification

**Auth**: Token-based (public). The token encodes the user ID and a hash of their current email + verification state. Successful validation flips `emailVerified` to `true`.

- Default response is an HTTP 302 redirect to `/verify-email?status=verified` so the browser page can show a success state.
- When the request carries `Accept: application/json`, the handler returns `{ "status": "verified" }` with `200 OK` instead of redirecting.
- Invalid tokens redirect to `/verify-email?status=error` (HTML flows) or emit `{ "error": "Verification token is invalid", "code": "INVALID_TOKEN" }` for JSON clients.

### POST /api/auth/resend-verification — Send verification email again

**Auth**: Required. Uses `getCurrentUser()` (populated by the middleware header) to ensure only the authenticated user can trigger the resend.

- Returns `{ "status": "sent" }` after generating a fresh token and emailing it through Resend.
- Returns `{ "status": "already_verified" }` if the current user has `emailVerified = true` to prevent noisy emails.

### POST /api/auth/forgot-password — Request a reset link

**Auth**: None. Accepts `{ "email": "jane@example.com" }` and always responds `200 OK` with `{ "message": "If the email exists, you will receive a reset link shortly." }` to avoid leaking which addresses are on file. When the user exists, the API queues an email pointing to `/reset-password?token=...`.

### POST /api/auth/reset-password/:token — Set a new password

**Auth**: Token-based. Accepts `{ "password": "NewPass1" }`, validates it against the policy, verifies the token context (ties token to the current password hash), and updates `passwordHash` when everything matches.

- **Success**: `{ "message": "Password has been reset" }` with `200 OK`.
- **Common errors**:
  - `400 VALIDATION_ERROR` — body missing or password too weak.
  - `400 INVALID_TOKEN` — token expired, already used (because the password changed), or user deleted.

### Resend Verification

```http
POST /api/auth/resend-verification
```

**Auth required.** If the current user is still unverified, a fresh email is dispatched. Response `{ "status": "sent" }` or `{ "status": "already_verified" }`.

### Forgot Password

```http
POST /api/auth/forgot-password
```

**Request Body**
```json
{ "email": "jane@example.com" }
```

Always responds `200 OK` with generic message. If the user exists, sends `/reset-password?token=...` link via email.

### Reset Password

```http
POST /api/auth/reset-password/:token
```

**Request Body**
```json
{ "password": "NewPass1" }
```

Verifies the reset token, enforces password policy, updates the stored hash. Response `{ "message": "Password has been reset" }`. Errors: `400 INVALID_TOKEN` for expired/used tokens.

---

## Organizations

All organization routes require an authenticated user. Role checks are enforced per endpoint as described below. See `docs→ARCHITECTURE.md` for the full domain model.

### Create Organization

```http
POST /api/organizations
```

**Auth**: Required (`OWNER` is implied for the creator).  
**Feature flags**: None.

**Request Body**:
```json
{
  "display_name": "Climate Ops",
  "description": "Internal footprint team",
  "logo_asset_id": "6d77dd52-4f08-4d1a-9a5f-09bb7d6f70cf"
}
```

- `display_name` — required, 3–64 characters.  
- `description` — optional, trimmed to 400 characters.  
- `logo_asset_id` — optional reference to an uploaded asset created via [`POST /api/uploads/sign`](#uploads).

**Response — 201 Created**:
```json
{
  "organization": {
    "id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
    "slug": "climate-ops",
    "display_name": "Climate Ops",
    "description": "Internal footprint team",
    "plan_code": "free",
    "plan_assigned_at": "2025-11-12T10:15:00Z",
    "plan_valid_until": null,
    "limits": {
      "max_active_projects": 1,
      "max_editors": 0,
      "max_verifiers": 0,
      "max_viewers": null
    }
  }
}
```

**Errors**:
- `400 BAD_REQUEST` — validation failures (missing display name, overlong description).  
- `409 CONFLICT` — slug collision (very rare; client should retry with a new name).  
- `413 PAYLOAD_TOO_LARGE` — description exceeds 4 KB after trimming.

### List Organizations

```http
GET /api/organizations
```

**Auth**: Required. Returns organizations where the user has an accepted membership.

**Query Params**:
- `includePending` (boolean, default `false`) — when `true`, include invitations (`invite_status=pending`).

**Response — 200 OK**:
```json
{
  "organizations": [
    {
      "id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
      "display_name": "Climate Ops",
      "plan_label": "Free",
      "role": "OWNER",
      "plan_valid_until": null,
      "active_projects": 1,
      "limits": {
        "max_active_projects": 1,
        "max_editors": 0,
        "max_verifiers": 0,
        "max_viewers": null
      }
    }
  ]
}
```

**Notes**:
- The first returned organization becomes the default active organization if the client has no selection cached.  
- Pending invitations include `invite_status` and omit usage metrics.

### Get Current Organization

```http
GET /api/organizations/current
```

**Auth**: Required.  
**Roles**: Any accepted member (`OWNER`, `ADMIN`, `EDITOR`, `VIEWER_READONLY`, `VIEWER_VERIFIER`).

**Response — 200 OK**:
```json
{
  "organization": {
    "id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
    "slug": "climate-ops",
    "display_name": "Climate Ops",
    "description": "Internal footprint team",
    "plan": {
      "code": "free",
      "label": "Free",
      "max_active_projects": 1,
      "max_editors": 0,
      "max_verifiers": 0,
      "max_viewers": null,
      "valid_until": null
    },
    "usage": {
      "active_projects": 1,
      "active_editors": 0,
      "active_verifiers": 0,
      "active_viewers": 3
    },
    "feature_flags": {
      "verifierRoleEnabled": false,
      "billingUiEnabled": true
    }
  }
}
```

**Errors**:
- `404 NOT_FOUND` — active organization id in session no longer exists or user lost access.

### Update Organization

```http
PATCH /api/organizations/:organizationId
```

**Auth**: Required.  
**Roles**: `OWNER` or `ADMIN`.

**Request Body**:
```json
{
  "display_name": "Climate Operations",
  "description": "Updated copy",
  "logo_asset_id": "0ebeaf41-7d50-4a47-9e76-5351c1dc54ac"
}
```

All properties optional; omit fields that are unchanged.

**Response — 200 OK**:
```json
{
  "organization": {
    "id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
    "display_name": "Climate Operations",
    "description": "Updated copy",
    "logo_asset_id": "0ebeaf41-7d50-4a47-9e76-5351c1dc54ac"
  }
}
```

**Errors**:
- `400 BAD_REQUEST` — invalid payload (e.g., empty display name).  
- `403 FORBIDDEN` — caller lacks admin privileges.  
- `409 CONFLICT` — attempting to reuse a soft-deleted logo asset.

### Delete Organization

```http
DELETE /api/organizations/:organizationId
```

**Auth**: Required.  
**Roles**: `OWNER` only.

**Behaviour**:
- Sets `status=deleted` and `deleted_at=now()` on the organization.  
- Cascades soft delete to all projects.  
- Returns retention deadline (30 days after deletion).  
- Blocks deletion when there is already a pending deletion.

**Response — 202 Accepted**:
```json
{
  "organization_id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
  "status": "deleted",
  "retention_expires_at": "2025-12-12T10:15:00Z"
}
```

**Errors**:
- `403 FORBIDDEN` — non-owner or owner attempting to delete while plan upgrade request is processing.  
- `409 CONFLICT` — organization already marked deleted.  
- `412 PRECONDITION_FAILED` — organization has no active projects but pending invites still exist (inform user to cancel invites first).

### Restore Organization

```http
POST /api/organizations/:organizationId/restore
```

**Auth**: Required.  
**Roles**: `OWNER` only.

**Behaviour**:
- Only callable for organizations with `status=deleted`.
- Enforces the 30-day retention window — after expiry the API returns `410 RETENTION_EXPIRED`.
- On success clears `deleted_at` and reactivates all soft-deleted child records asynchronously.

**Response — 200 OK**:
```json
{
  "organization_id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
  "status": "active"
}
```

**Errors**:
- `403 FORBIDDEN` — caller is not an owner.  
- `404 NOT_FOUND` — organization missing or belongs to another tenant.  
- `409 CONFLICT` — organization is not deleted.  
- `410 RETENTION_EXPIRED` — soft-delete retention window lapsed.

---

## Organization Plans

### List Plan Definitions

```http
GET /api/plan-definitions
```

**Auth**: Required.  
**Roles**: Any authenticated user.

**Response — 200 OK**:
```json
{
  "plans": [
    {
      "code": "free",
      "label": "Free",
      "description": "Single project workspace",
      "max_active_projects": 1,
      "max_editors": 0,
      "max_verifiers": 0,
      "max_viewers": null
    },
    {
      "code": "pro_beta",
      "label": "Pro Beta",
      "description": "Expanded seats and projects",
      "max_active_projects": 3,
      "max_editors": 2,
      "max_verifiers": 0,
      "max_viewers": null
    }
  ]
}
```

### Request Plan Upgrade

```http
POST /api/organizations/:organizationId/plan/upgrade
```

**Auth**: Required.  
**Roles**: `OWNER` or `ADMIN`.  
**Status**: Placeholder — records intent, returns `501`.

**Request Body**:
```json
{
  "target_plan_code": "pro_beta",
  "contact_email": "billing@climateops.io",
  "notes": "Need more editor seats"
}
```

**Response — 501 Not Implemented**:
```json
{
  "status": "not_implemented",
  "message": "Upgrade flow is handled manually during beta.",
  "ticket_reference": "UPG-2025-11-12-001"
}
```

**Side effects**: logs the request (via email or database table) for the support team to follow up manually.

**Errors**:
- `400 BAD_REQUEST` — unsupported `target_plan_code`.  
- `409 CONFLICT` — upgrade already pending.

---

## Organization Memberships

### List Members

```http
GET /api/organizations/:organizationId/members
```

**Auth**: Required.  
**Roles**: Any accepted member.

**Query Params**:
- `status` — optional filter (`pending`, `accepted`).
- `role` — optional filter (`OWNER`, `ADMIN`, `EDITOR`, `VIEWER_READONLY`, `VIEWER_VERIFIER`).

**Response — 200 OK**:
```json
{
  "members": [
    {
      "membership_id": "5c93c2e4-88f6-4db9-8d7a-395e8c06699c",
      "user_id": "3a4b15c9-2f24-4b65-9a44-4ad697e5dd01",
      "role": "OWNER",
      "invite_status": "accepted",
      "joined_at": "2025-10-01T09:00:00Z",
      "last_active_at": "2025-11-11T15:45:00Z"
    }
  ]
}
```

### Invite Member

```http
POST /api/organizations/:organizationId/invite
```

**Auth**: Required.  
**Roles**: `OWNER` or `ADMIN`.

**Request Body**:
```json
{
  "email": "alex@example.com",
  "role": "EDITOR",
  "message": "Join us in preparing the CBAM submission."
}
```

**Rules**:
- Editors and verifiers enforce plan limits.  
- Viewers are unlimited but tracked.  
- Duplicate pending invites are idempotent (returns existing invite).

**Response — 201 Created**:
```json
{
  "invite": {
    "membership_id": "c4d88a37-7ace-4c43-b5f4-4b0a0e473930",
    "email": "alex@example.com",
    "role": "EDITOR",
    "invite_status": "pending"
  }
}
```

**Errors**:
- `409 CONFLICT` — seat limit reached (returns error code `SEAT_LIMIT_EXCEEDED`).  
- `422 UNPROCESSABLE_ENTITY` — invalid email or role.

Limit Error Example:
```json
{
  "error": "No editor seats available",
  "code": "SEAT_LIMIT_EXCEEDED",
  "details": { "limit": 2, "current": 2, "role": "EDITOR" }
}
```

### Update Member Role

```http
PATCH /api/organizations/:organizationId/members/:membershipId
```

**Auth**: Required.  
**Roles**: `OWNER` or `ADMIN` (cannot modify owners).

**Request Body**:
```json
{
  "role": "ADMIN"
}
```

**Response — 200 OK**:
```json
{
  "membership": {
    "membership_id": "5c93c2e4-88f6-4db9-8d7a-395e8c06699c",
    "role": "ADMIN"
  }
}
```

**Errors**:
- `400 BAD_REQUEST` — missing role.  
- `403 FORBIDDEN` — attempting to change owner role.  
- `409 CONFLICT` — plan limit would be exceeded by the new role.

### Remove Member

```http
DELETE /api/organizations/:organizationId/members/:membershipId
```

**Auth**: Required.  
**Roles**: `OWNER` or `ADMIN` (owners cannot remove themselves).

**Response — 204 No Content**

**Errors**:
- `403 FORBIDDEN` — trying to remove the sole owner.  
- `404 NOT_FOUND` — membership not found or already removed.

### Accept Invitation

```http
POST /api/organizations/:organizationId/members/:membershipId/accept
```

**Auth**: Required (invited user only).

**Behaviour**:
- Enforces seat limits for `EDITOR` and `VIEWER_VERIFIER` using the same checks as invite creation.  
- Updates the invitation to `accepted`, sets `joined_at`/`last_active_at`, and returns the normalized status for client state reconciliation.  
- Fails if the invite was already accepted/declined or belongs to a deleted organization.

**Response — 200 OK**:
```json
{
  "membership": {
    "membership_id": "5c93c2e4-88f6-4db9-8d7a-395e8c06699c",
    "invite_status": "accepted"
  }
}
```

**Errors**:
- `403 FORBIDDEN` — logged-in user is not the invitee.  
- `404 NOT_FOUND` — membership missing or organization deleted.  
- `409 CONFLICT` — invitation already processed.  
- `422 VALIDATION_ERROR` — verifier role disabled via feature flag.

### Decline Invitation

```http
POST /api/organizations/:organizationId/members/:membershipId/decline
```

**Auth**: Required (invited user only).

**Behaviour**:
- Marks the invite as `declined` so seats are released immediately.  
- Only allowed while `invite_status=pending`.

**Response — 200 OK**:
```json
{
  "membership": {
    "membership_id": "5c93c2e4-88f6-4db9-8d7a-395e8c06699c",
    "invite_status": "declined"
  }
}
```

**Errors**:
- `403 FORBIDDEN` — logged-in user is not the invitee.  
- `404 NOT_FOUND` — membership missing or organization deleted.  
- `409 CONFLICT` — invitation already processed.

---

## Organization Usage

```http
GET /api/organizations/:organizationId/usage
```

**Auth**: Required.  
**Roles**: Any accepted member.

**Response — 200 OK**:
```json
{
  "organization_id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
  "usage": {
    "active_projects": 1,
    "active_editors": 0,
    "active_verifiers": 0,
    "active_viewers": 3
  },
  "limits": {
    "max_active_projects": 3,
    "max_editors": 2,
    "max_verifiers": 0,
    "max_viewers": null
  },
  "plan_valid_until": "2025-12-15T00:00:00Z"
}
```

Future Extension:
```json
{
  "organization_id": "...",
  "usage": { /* current snapshot */ },
  "limits": { /* plan limits */ },
  "snapshots": [
    { "computed_at": "2025-11-11T00:00:00Z", "active_projects": 1, "active_editors": 0 },
    { "computed_at": "2025-11-12T00:00:00Z", "active_projects": 1, "active_editors": 1 }
  ]
}
```

**Notes**:
- Endpoint is idempotent and can be polled for dashboards.  
- Server may respond with cached values (ETag recommended).  
- Future enhancement: include latest `organization_usage_snapshots` array.

### Recompute Usage Snapshot

```http
POST /api/organizations/:organizationId/usage/recompute
```

**Auth**: Required.  
**Roles**: `ADMIN` or `OWNER` (requires accepted membership).

**Purpose**: Forces a new `organization_usage_snapshots` row to be computed when limits appear stale (e.g., after bulk seat imports).

**Response — 201 Created**:
```json
{
  "snapshot": {
    "id": "usage_snap_01hf9vse7kg2mteq3e6p1wm2r0",
    "computed_at": "2025-11-12T11:15:00Z",
    "active_projects": 2,
    "active_editors": 1,
    "active_verifiers": 0,
    "active_viewers": 4
  }
}
```

**Errors**:
- `404 NOT_FOUND` — organization missing or deleted.  
- `409 CONFLICT` — usage recompute attempted for deleted organizations.  
- `429 TOO_MANY_REQUESTS` — server-side guardrail if recompute is spammed (future safeguard).

---

## Uploads

### Generate Signed Upload URL

```http
POST /api/uploads/sign
```

**Auth**: Required.  
**Roles**: Any authenticated user (permissions enforced on the consumer route).

**Request Body**:
```json
{
  "resource_type": "org_logo",
  "file_name": "logo.png",
  "mime_type": "image/png",
  "file_size_bytes": 102400
}
```

`resource_type` accepts `org_logo` or `user_avatar` (extend as needed).

Constraints:

- `mime_type` must be one of `image/png`, `image/jpeg` (or `image/jpg` alias), or `image/svg+xml`.  
- `file_size_bytes` cannot exceed **512 KB**; the server signs the POST with a matching `content-length-range`.  
- Logos and avatars must be **square** within a 10% tolerance when they are applied to an organization or user profile; clients should crop before uploading to avoid follow-up validation errors.

**Response — 201 Created**:
```json
{
  "upload": {
    "asset_id": "6d77dd52-4f08-4d1a-9a5f-09bb7d6f70cf",
    "url": "https://uploads.example.com/signature",
    "expires_at": "2025-11-12T10:25:00Z",
    "fields": {
      "key": "uploads/org_logo/6d77dd52-...",
      "policy": "base64-policy",
      "signature": "signature"
    }
  }
}
```

**Client flow**:
1. Call this endpoint to obtain signed URL and form fields.  
2. Upload file directly to storage provider.  
3. On success, pass `asset_id` to the relevant PATCH endpoint.

**Errors**:
- `400 BAD_REQUEST` — invalid resource type, missing metadata.  
- `413 PAYLOAD_TOO_LARGE` — file size exceeds 512 KB.  
- `415 UNSUPPORTED_MEDIA_TYPE` — MIME type not allowed.  
- `429 TOO_MANY_REQUESTS` — per-user upload rate limit.

---

## Projects

### List Projects

```http
GET /api/projects
```

**Auth**: Required.  
**Roles**: `OWNER`, `ADMIN`, `EDITOR`, `VIEWER_READONLY`, `VIEWER_VERIFIER` (restricted to organizations the user belongs to).

**Query Params**:
- `organization_id` — filter projects for a specific organization (defaults to active organization).  
- `status` — optional filter (`active`, `archived`, `reported`, `deleted`).  
- `includeDeleted` — boolean, when `true` returns records with status `deleted` (defaults to `false`).

**Response — 200 OK**:
```json
{
  "projects": [
    {
      "id": "c51f0790-114f-4b53-83e6-6a63cb9dd2a1",
      "organization_id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
      "name": "ISO 14067 FY24",
      "status": "active",
      "reports_count": 2,
      "dataset_version": 5,
      "created_at": "2025-10-12T10:00:00Z",
      "updated_at": "2025-11-10T08:30:00Z"
    }
  ]
}
```

**Notes**:
- Endpoint orders results by `updated_at DESC`.  
- Use pagination (`page`, `pageSize`) once dataset grows (future enhancement).

---

### Create Project

```http
POST /api/projects
```

**Auth**: Required.  
**Roles**: `OWNER`, `ADMIN`, `EDITOR` within the target organization.

**Request Body**:
```json
{
  "organization_id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
  "name": "ISO 14067 FY24",
  "template_codes": ["ISO14067", "CBAM"]
}
```

**Initialization**:
- `status` defaults to `active`.  
- `dataset` initialises with `{ "data_points": [] }`.  
- `dataset_version` set to `0`.  
- `mailto_templates`, `reports`, and `checklist` seeded from template configs.  
- Owner automatically added as project owner via membership.

**Response — 201 Created**:
```json
{
  "project": {
    "id": "c51f0790-114f-4b53-83e6-6a63cb9dd2a1",
    "organization_id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
    "name": "ISO 14067 FY24",
    "status": "active",
    "dataset_version": 0,
    "created_at": "2025-11-12T10:30:00Z"
  },
  "reports": [
    {
      "id": "4ee5a9e6-1d80-4cf5-879d-b9a7ef87ec84",
      "template_code": "ISO14067",
      "completion": 0
    }
  ]
}
```

**Errors**:
- `400 BAD_REQUEST` — validation errors (missing name, invalid template code).  
- `403 FORBIDDEN` — user lacks permissions in the target organization.  
- `404 NOT_FOUND` — organization id not found or soft deleted.  
- `409 CONFLICT` (`PLAN_LIMIT_EXCEEDED`) — creating the project would exceed `max_active_projects` for the plan.

### Update Project Status

```http
PATCH /api/projects/:id/status
```

**Auth**: Required.  
**Roles**: `OWNER`, `ADMIN`, `EDITOR`.

**Request Body**:
```json
{ "status": "archived" }
```
Allowed `status` values: `active`, `archived`, `reported`, `deleted`.

Rules:
1. Transition to `active` performs limit check.
2. Transition to `reported` locks dataset/report editing (no direct revert—must use restore endpoint).
3. Transition to `deleted` sets `deleted_at` (soft-delete); restore allowed within retention window.
4. Direct transitions `reported → archived` or `reported → deleted` require using restore (explicit design choice simplifying reversible path).

**Response — 200 OK**:
```json
{
  "project": { "id": "c51f0790-114f-4b53-83e6-6a63cb9dd2a1", "status": "archived" }
}
```

**Errors**:
- `400 BAD_REQUEST` — unsupported status.
- `403 FORBIDDEN` — caller lacks role.
- `409 PLAN_LIMIT_EXCEEDED` — attempting to set `active` over limit (details object included).
- `409 VERSION_CONFLICT` — stale precondition header if optimistic status versioning added later.
- `404 NOT_FOUND` — project not found or organization soft-deleted.

### Delete Project (Soft)

```http
DELETE /api/projects/:id
```

Equivalent to setting status to `deleted` if not already. Idempotent.

**Response — 202 Accepted**:
```json
{
  "project_id": "c51f0790-114f-4b53-83e6-6a63cb9dd2a1",
  "status": "deleted",
  "retention_expires_at": "2025-12-12T10:15:00Z"
}
```

**Errors**:
- `404 NOT_FOUND` — project missing.
- `409 CONFLICT` — already deleted (returns same payload with an `already_deleted` flag optionally).

### Restore Project

```http
POST /api/projects/:id/restore
```

Restores a project from `archived`, `reported`, or `deleted` back to `active` (subject to limits & retention).

**Response — 200 OK**:
```json
{
  "project": { "id": "c51f0790-114f-4b53-83e6-6a63cb9dd2a1", "status": "active" },
  "limit_check": { "resource": "active_projects", "current": 0, "limit": 3 }
}
```

**Errors**:
- `409 PLAN_LIMIT_EXCEEDED` — would exceed active project limit.
- `409 RETENTION_EXPIRED` — soft-deleted beyond 30-day window.
- `404 NOT_FOUND` — project id invalid.
- `403 FORBIDDEN` — user lacks permissions in owning organization.

Edge Cases:
- Restoring from `reported` re-opens editing; UI must confirm undoing finalisation semantics.
- Attempting to restore already `active` returns 200 with no changes (idempotent).

---

## Dataset

### Get Dataset

```http
GET /api/projects/:id/dataset
```

**Response**:
```json
{
  "projectId": "uuid",
  "projectName": "Project Name",
  "dataset": {
    "data_points": [
      {
        "field_id": "product_name",
        "item_id": null,
        "value": "Electric Bicycle"
      }
    ]
  },
  "datasetVersion": 5
}
```

**Notes**:
- Returns full dataset with current version
- Optional validation applied (non-breaking)

---

### Update Dataset

```http
PUT /api/projects/:id/dataset
```

**Request Body**:
```json
{
  "dataset": {
    "data_points": [
      {
        "field_id": "product_name",
        "item_id": null,
        "value": "Electric Bicycle"
      }
    ]
  },
  "datasetVersion": 5
}
```

**Response (Success)**:
```json
{
  "success": true,
  "projectId": "uuid",
  "datasetVersion": 6,
  "message": "Dataset updated successfully"
}
```

**Response (Conflict)**:
```json
{
  "error": "Concurrent edit detected",
  "message": "Someone else has modified this project. Please reload and try again.",
  "code": "VERSION_CONFLICT"
}
```
Status: `409 Conflict`

**Optimistic Locking**:
1. Client sends current `datasetVersion` (e.g., 5)
2. Server checks: `WHERE id = :id AND datasetVersion = 5`
3. If match: Update dataset, increment to 6
4. If no match: Return 409 error (someone else updated first)

**Validation**:
 - Dataset structure validated with Zod
 - All `field_id` values must exist in the database (`DatasetFieldDefinition.fieldId`, snake_case)
- `item_id` can be null or string
- `value` must be string

**Response (Invalid Field)**:
```json
{
  "error": "Unknown dataset field_id",
  "code": "UNKNOWN_FIELD_ID",
  "fieldIds": ["invalid_field"]
}
```
Status: `400 Bad Request`

### Update Single Data Point

```http
PATCH /api/projects/:id/dataset
```

**Request Body**:
```json
{
  "field_id": "product_name",
  "item_id": null,
  "value": "Updated Value",
  "datasetVersion": 6
}
```

**Response (Success)**:
```json
{
  "success": true,
  "datasetVersion": 7,
  "updatedDataPoint": {
    "field_id": "product_name",
    "item_id": null,
    "value": "Updated Value"
  }
}
```

**Response (Invalid Field)**:
```json
{
  "error": "Unknown dataset field_id",
  "code": "UNKNOWN_FIELD_ID",
  "fieldIds": ["product_name_typo"]
}
```
Status: `400 Bad Request`

**Response (Conflict)**: Same as PUT endpoint (`409 VERSION_CONFLICT`) when `datasetVersion` is stale.

### Delete Repeatable Item

```http
DELETE /api/projects/:id/dataset/items/:itemId?datasetVersion=6
```

**Response (Success)**:
```json
{
  "success": true,
  "datasetVersion": 7,
  "deletedCount": 3
}
```

**Response (Invalid Field)**:
```json
{
  "error": "Unknown dataset field_id",
  "code": "UNKNOWN_FIELD_ID",
  "fieldIds": ["material_input_legacy"]
}
```
Status: `400 Bad Request`

**Notes**:
- Requires latest `datasetVersion` (supplied via query parameter) for optimistic locking.
- Removes every data point with the matching `item_id`.
- Returns `404` if the item does not exist.

---

## Reports

### Get Report Data

```http
GET /api/projects/:projectId/reports/:reportId
```

**Response**:
```json
{
  "reportInfo": {
    "id": "uuid",
    "projectId": "uuid",
    "templateCode": "ISO14067",
    "createdAt": "2025-10-12T10:00:00Z",
    "updatedAt": "2025-10-12T11:00:00Z"
  },
  "template": {
    "code": "ISO14067",
    "name": "ISO 14067:2018 Carbon Footprint",
    "version": "1.0.0",
    "description": "Product carbon footprint standard",
    "sections": [
      {
        "id": "product_info",
        "title": "Product Information",
        "fields": [
          {
            "id": "product_name",
            "label": "Product Name",
            "type": "text",
            "required": true
          }
        ]
      }
    ]
  },
  "dataset": {
    "data_points": [
      {
  "field_id": "product_name",
        "item_id": null,
        "value": "Electric Bicycle"
      }
    ]
  },
  "datasetVersion": 5,
  "completion": 33,
  "metadata": {}
}
```

**Data Filtering**:
- Loads template from `src/lib/report-templates/[templateCode].ts`
- Extracts all `field_id` values from template sections
- Filters `Project.dataset` to include only those fields
- **Does NOT read `Report.data`** (field removed from schema)

**Completion Calculation**:
```
completion = (filled_required_fields / total_required_fields) * 100
```

---

## Mailto Templates

### Get All Templates

```http
GET /api/projects/:id/mailto-templates
```

**Response**:
```json
{
  "projectId": "uuid",
  "projectName": "Project Name",
  "mailtoTemplates": {
  "product_name": {
      "subject": "Request for Product Name",
      "body": "Hi {{contact_name}}, ..."
    },
    "Material_Name": {
      "subject": "Request for Material Name",
      "body": "..."
    }
  }
}
```

**Storage**: `Project.mailtoTemplates` JSONB field

---

### Update Single Template

```http
PUT /api/projects/:id/mailto-templates/:fieldId
```

**Request Body**:
```json
{
  "subject": "Custom Subject",
  "body": "Custom body with {{contact_name}} placeholder"
}
```

**Response**:
```json
{
  "success": true,
  "fieldId": "product_name",
  "template": {
    "subject": "Custom Subject",
    "body": "Custom body with {{contact_name}} placeholder"
  },
  "message": "Mailto template updated successfully"
}
```

**Allowed Placeholders**:
- `{{contact_name}}` — Recipient name
- `{{project_name}}` — Project name
- `{{field_display_name}}` — Field label from the template
- `{{field_list}}` — Bullet list of selected fields for bulk requests
- `{{deadline}}` — Optional deadline date
- `{{requester_signature}}` — Auto-generated signature combining project owner name and project name

**Validation**:
- `subject`: Required, min 1 character
- `body`: Required, min 1 character
- Placeholder validation not enforced (planned)

---

### Reset All Templates

```http
POST /api/projects/:id/mailto-templates
```

**Response**:
```json
{
  "success": true,
  "message": "Mailto templates reset to defaults",
  "mailtoTemplates": {
  "product_name": {
      "subject": "...",
      "body": "..."
    }
  }
}
```

**Behavior**:
- Reloads defaults from all report template configs
- Overwrites entire `Project.mailtoTemplates` JSONB
- Useful after template updates or to undo customizations

---

## Data Requests

### Create or Update Bulk Requests

```http
POST /api/data-requests/bulk
```

Logs outgoing email requests and manages active assignments per field.

**Request Body**:
```json
{
  "projectId": "uuid",
  "contact": {
    "id": "uuid",
    "email": "alex@example.com",
    "name": "Alex Johnson"
  },
  "deadline": "2025-11-15",
  "fields": [
    {
      "dataPointId": "material_input_name",
      "itemId": "1",
      "fieldLabel": "Material name"
    },
    {
      "dataPointId": "material_input_amount",
      "itemId": "1"
    }
  ],
  "mailtoPreview": {
    "subject": "Carbon data request",
    "body": "Hi {{contact_name}}, ..."
  }
}
```

**Response**:
```json
{
  "requests": [
    {
      "id": "uuid",
      "status": "pending",
      "requestedAt": "2025-10-29T21:22:51.276Z",
      "completedAt": null,
      "revokedAt": null,
      "deadline": "2025-11-15T00:00:00.000Z",
      "contact": {
        "id": "uuid",
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "position": null
      },
      "dataPoint": {
        "id": "material_input_name",
        "itemId": "1",
        "label": "Material name",
        "hint": "Source of data for the material"
      }
    }
  ]
}
```

**Behavior**:
- Each field generates exactly one active request; previous assignments are revoked automatically (`revoked_at = NOW()`).
- Contact is resolved by ID (if provided) or looked up/created by email.
- Deadline accepts ISO date strings; plain dates are normalized to midnight UTC.
- `mailtoPreview` payload is required but currently ignored server-side (reserved for future logging).

**Validation**:
- `projectId`: Required UUID belonging to the authenticated user (dev-mode auto user).
- `contact`: Email required; `id` optional and must belong to project owner if supplied.
- `fields`: Non-empty array. Each entry needs `dataPointId`; `fieldLabel`, `itemId`, `group` optional.
- `deadline`: Optional ISO-8601 date or date-time string.

---

### List Project Requests

```http
GET /api/projects/:id/data-requests?status=active&contact=uuid
```

**Query Parameters**:
- `status`: `active` (default) | `closed` | `overdue` | `all`
- `contact`: Filter by contact UUID (optional)
- `sort`: `requested_at` | `deadline` | `field_id` (default `requested_at DESC`)

**Response**:
```json
{
  "requests": [
    {
      "id": "uuid",
      "status": "pending",
      "requestedAt": "2025-10-29T21:22:51.276Z",
      "completedAt": null,
      "revokedAt": null,
      "deadline": null,
      "contact": {
        "id": "uuid",
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "position": null
      },
      "dataPoint": {
        "id": "material_input_name",
        "itemId": "1",
        "label": "Material name",
        "hint": "Source of data for the material"
      }
    }
  ]
}
```

**Status Logic**:
- `pending`: Neither `completed_at` nor `revoked_at` set.
- `completed`: `completed_at` present.
- `revoked`: `revoked_at` present.
- `overdue` filter overlays `pending` requests whose deadline has passed.

---

### Mark Request Complete

```http
POST /api/data-requests/:id/complete
```

**Request Body** (optional):
```json
{
  "completedAt": "2025-10-30T09:13:22.029Z"
}
```

**Response**:
```json
{
  "request": {
    "id": "uuid",
    "status": "completed",
    "requestedAt": "2025-10-29T21:22:51.276Z",
    "completedAt": "2025-10-30T09:13:22.029Z",
    "revokedAt": null,
    "deadline": null,
    "contact": {
      "id": "uuid",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "position": null
    },
    "dataPoint": {
      "id": "material_input_name",
      "itemId": "1",
      "label": "Material name",
      "hint": "Source of data for the material"
    }
  }
}
```

**Behavior**:
- Defaults `completedAt` to the current timestamp if omitted or blank.
- Idempotent: subsequent calls return the same payload without mutating timestamps.
- Returns `409 Conflict` when attempting to complete a revoked request.

---

### Revoke Request

```http
POST /api/data-requests/:id/revoke
```

**Request Body** (optional):
```json
{
  "revokedAt": "2025-10-30T09:15:00Z"
}
```

**Response**:
```json
{
  "request": {
    "id": "uuid",
    "status": "revoked",
    "requestedAt": "2025-10-29T21:22:51.276Z",
    "completedAt": null,
    "revokedAt": "2025-10-30T09:15:00.000Z",
    "deadline": null,
    "contact": {
      "id": "uuid",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "position": null
    },
    "dataPoint": {
      "id": "material_input_name",
      "itemId": "1",
      "label": "Material name",
      "hint": "Source of data for the material"
    }
  }
}
```

**Behavior**:
- Defaults `revokedAt` to the current timestamp if omitted or blank.
- Clears any accidental completion timestamp (`completed_at` set to null).
- Idempotent: re-running returns the original data without changing timestamps.
- Returns `409 Conflict` when attempting to revoke a completed request.

---

## User Settings

### Get User Settings

```http
GET /api/user/settings
```

**Auth**: Required (current signed-in user).

**Response — 200 OK**:
```json
{
  "user": {
    "id": "4e87c13d-5e21-4b30-a25b-83cf41f2114f",
    "email": "casey@example.com",
    "name": "Casey Example",
    "first_name": "Casey",
    "last_name": "Example",
    "job_title": "Sustainability Lead",
    "timezone": "America/Los_Angeles",
    "avatar_url": "https://assets.example.com/uploads/user-avatar/...",
    "organizations": [
      {
        "organization_id": "a9e9c1ef-e86f-4a12-95dd-0bdf76b1c915",
        "display_name": "Climate Ops",
        "role": "ADMIN",
        "status": "active",
        "invite_status": "accepted"
      }
    ]
  }
}
```

### Update User Settings

```http
PATCH /api/user/settings
```

**Request Body** (all fields optional, at least one required):
```json
{
  "first_name": "Casey",
  "last_name": "Example",
  "job_title": "Sustainability Lead",
  "timezone": "America/Los_Angeles",
  "avatar_asset_id": "6d77dd52-4f08-4d1a-9a5f-09bb7d6f70cf"
}
```

Validation rules:
- `first_name`, `last_name`: 1–64 chars, unicode letters/numbers/dashes/apostrophes.  
- `job_title`: max 128 chars, trims to `null` when blank.  
- `timezone`: must be a valid IANA identifier (checked via `Intl.DateTimeFormat`).  
- `avatar_asset_id`: must reference an uploaded asset of type `user_avatar` owned by the user.

**Response — 200 OK**:
```json
{
  "user": {
    "id": "4e87c13d-5e21-4b30-a25b-83cf41f2114f",
    "first_name": "Casey",
    "last_name": "Example",
    "job_title": "Sustainability Lead",
    "timezone": "America/Los_Angeles",
    "avatar_url": "https://assets.example.com/uploads/user-avatar/..."
  }
}
```

**Errors**:
- `400 VALIDATION_ERROR` — invalid name/timezone payload (includes flattened issues).  
- `404 NOT_FOUND` — user missing (should not happen in normal flows).  
- `409 CONFLICT` — avatar asset already attached elsewhere.

### Change Password (Placeholder)

```http
POST /api/user/settings/change-password
```

Currently returns `501 NOT_IMPLEMENTED` with `{ "status": "not_implemented" }`. Wire up UI to show a “coming soon” toast instead of treating it as a failure.

---

## Error Responses

### Validation Error (400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["name"],
      "message": "Project name must be at least 3 characters"
    }
  ]
}
```

### Not Found (404)

```json
{
  "error": "Project not found"
}
```

### Conflict (409)

```json
{
  "error": "Concurrent edit detected",
  "message": "Someone else has modified this project. Please reload and try again.",
  "code": "VERSION_CONFLICT"
}
```

**Client Handling**:
```typescript
if (response.status === 409) {
  // Reload data and prompt user to retry
  const freshData = await fetchDataset(projectId)
  showConflictDialog(freshData)
}
```

### Server Error (500)

```json
{
  "error": "Failed to create project"
}
```

Logs contain detailed error information.

### Unified Error Envelope
All errors SHOULD use structure:
```json
{ "error": "Human readable message", "code": "PLAN_LIMIT_EXCEEDED", "details": {"limit":1,"current":1,"needed":1} }
```

| Code | Meaning | Typical HTTP Status | Details Fields |
|------|---------|---------------------|----------------|
| `VALIDATION_ERROR` | Payload fails schema | 400 | `fields` array (optional) |
| `FORBIDDEN` | Insufficient role | 403 | `requiredRole` |
| `NOT_FOUND` | Resource missing | 404 | `resource` |
| `PLAN_LIMIT_EXCEEDED` | Project limit hit | 409 | `limit`, `current`, `needed`, `resource` |
| `SEAT_LIMIT_EXCEEDED` | Seat limit hit | 409 | `limit`, `current`, `role` |
| `VERSION_CONFLICT` | Optimistic lock failed | 409 | `expectedVersion`, `currentVersion` |
| `RETENTION_EXPIRED` | Soft-delete window passed | 410 | `deleted_at`, `window_days` |
| `UPGRADE_NOT_IMPLEMENTED` | Upgrade not available | 501 | `target_plan_code` |

### Example: Plan Limit Exceeded
```json
{
  "error": "Active project limit reached",
  "code": "PLAN_LIMIT_EXCEEDED",
  "details": { "limit": 3, "current": 3, "needed": 1, "resource": "active_projects" }
}
```

### Example: Retention Expired
```json
{
  "error": "Project retention period expired",
  "code": "RETENTION_EXPIRED",
  "details": { "deleted_at": "2025-10-01T00:00:00Z", "window_days": 30 }
}
```

---

## Data Structures

### Dataset Schema

```typescript
{
  data_points: Array<{
  field_id: string,       // Must match DB (DatasetFieldDefinition.fieldId - snake_case)
    item_id: string | null, // For repeatable items (e.g., materials list)
    value: string           // All values stored as strings
  }>
}
```

**Validation**: `src/lib/dataset-validation.ts`

**Uniqueness**: Combination of `field_id + item_id` must be unique

---

## Helpers & Utilities

### Dataset Validation

**File**: `src/lib/dataset-validation.ts`

```typescript
import { validateDataset, upsertDataPoint, calculateCompletion } from '@/lib/dataset-validation'

// Validate structure
const dataset = validateDataset(rawData) // Throws if invalid

// Add/update field
const updated = upsertDataPoint(dataset, 'product_name', 'Electric Bicycle')

// Calculate completion
const percent = calculateCompletion(dataset, ['product_name', 'material_input_name'])
// Returns: 50 (if only Product_Name filled)
```

### Report Templates

**File**: `src/lib/report-templates/index.ts`

```typescript
import { getReportTemplate } from '@/lib/report-templates'

const template = getReportTemplate('ISO14067')
// Returns: { code, name, version, sections, mailto }
```

---

## Implementation Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/projects` | ✅ Complete | Returns all non-deleted projects |
| `POST /api/projects` | ✅ Complete | Initializes mailtoTemplates, dataset, reports |
| `GET /api/projects/:id/dataset` | ✅ Complete | With optional validation |
| `PUT /api/projects/:id/dataset` | ✅ Complete | Optimistic locking implemented |
| `GET /api/projects/:projectId/reports/:reportId` | ✅ Complete | Filters by template field_ids |
| `GET /api/projects/:id/mailto-templates` | ✅ Complete | Returns JSONB |
| `PUT /api/projects/:id/mailto-templates/:fieldId` | ✅ Complete | Zod validation |
| `POST /api/projects/:id/mailto-templates` | ✅ Complete | Resets to defaults |
| `GET /api/projects/:id/data-requests` | ✅ Complete | Filters, sorting, status flags |
| `POST /api/data-requests/bulk` | ✅ Complete | Creates/reassigns data requests |
| `POST /api/data-requests/:id/complete` | ✅ Complete | Idempotent completion handler |
| `POST /api/data-requests/:id/revoke` | ✅ Complete | Idempotent revoke handler |

**Not Implemented (Optional)**:
- `POST /api/projects/:id/duplicate` — Clone project
- `POST /api/projects/:id/reports` — Add report type
- `PUT /api/projects/:id/reports/:reportId/metadata` — Report settings

---

## Testing

### Manual Testing

**Create Project**:
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "templateCodes": ["ISO14067"],
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Update Dataset**:
```bash
curl -X PUT http://localhost:3000/api/projects/:id/dataset \
  -H "Content-Type: application/json" \
  -d '{
    "dataset": {
      "data_points": [
        {
          "field_id": "Product_Name",
          "item_id": null,
          "value": "Electric Bicycle"
        }
      ]
    },
    "datasetVersion": 0
  }'
```

**Test Conflict**:
1. Open two browser tabs
2. Load same dataset in both
3. Edit and save in tab 1 → Success (version 0 → 1)
4. Edit and save in tab 2 → 409 Conflict (still has version 0)

---

## Future Enhancements

**Planned** (Post-MVP):
- WebSocket updates for real-time collaboration
- Batch operations for dataset updates
- Advanced filtering and pagination
- Audit log for all changes
- Role-based access control
- API rate limiting
- GraphQL alternative

**Under Consideration**:
- Versioned snapshots of datasets
- Undo/redo functionality
- Diff view for concurrent edits
- Auto-merge non-conflicting changes

---

**Last Updated**: October 30, 2025  
**Maintained By**: Development Team  
**Questions**: Refer to `ARCHITECTURE.md` or `DEVELOPMENT.md`
