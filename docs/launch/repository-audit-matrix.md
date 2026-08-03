# Repository Audit Matrix

| Area | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Authentication | Implemented | Prompt 1 routes and Supabase auth | Production email/MFA settings require provider verification. |
| Workspaces and RBAC | Implemented | Migrations 0001-0002 | Final RLS smoke tests are automated and documented. |
| Course builder | Implemented | Prompt 3 | Course publish remains review-controlled. |
| Commerce and enrollments | Implemented | Prompt 4 | M-Pesa production credentials remain external. |
| Certificates | Implemented | Prompt 4 | Public verification endpoint and API foundation present. |
| Academy operations | Implemented | Prompt 5 | Automated payouts deferred to provider adapters. |
| Enterprise LMS | Implemented | Prompt 6 | HR integrations are foundation only. |
| Solco Live | Implemented | Prompt 7 | Live provider remains mock/configurable until credentials are verified. |
| Solco Intelligence | Implemented | Prompt 8 | Active provider is mock; real provider verification required. |
| Billing and subscriptions | Implemented | Prompt 9 | Invoice PDF provider is deferred. |
| Support and knowledge base | Implemented | Prompt 9 | Article authoring exists as schema/foundation. |
| Security center | Implemented | Prompt 9 | Supabase Auth MFA enforcement must be configured. |
| Public APIs | Partially implemented | Prompt 10 `/api/v1` | Courses, certificate verification, webhook event queue foundation present. |
| Webhooks | Partially implemented | Prompt 10 | Signed payload helper and delivery logs exist; delivery worker deferred. |
| Integrations | Placeholder | Prompt 10 directory | Provider connections require credentials and staging tests. |
| PWA | Partially implemented | Manifest, service worker, offline page | Offline private data is intentionally not cached. |
| CI | Implemented | `.github/workflows/ci.yml` | Uses local env validation. |
| Deployment | Documented | Launch runbook | Production secrets and provider credentials are external. |
| Backup/restore | Documented + trackable | Backup jobs table/runbook | Actual restore test requires Supabase production/staging infrastructure. |

## Critical Gaps Resolved

- Added API-key hashing and scoped public API foundation.
- Added webhook endpoint/delivery schema and signing helper.
- Added maintenance-mode protection for unsafe financial paths.
- Added PWA offline shell without caching private data.
- Added launch docs, runbooks, SEO files, and CI workflow.

## Remaining Credential-Blocked Items

- Production M-Pesa verification.
- Email/SMS provider delivery and bounce handling.
- Live provider production room creation.
- Real AI provider routing and billing.
- External monitoring/error reporting.
- Supabase backup restore test in isolated staging.
