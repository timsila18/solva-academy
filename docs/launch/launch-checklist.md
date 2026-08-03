# Launch Checklist

## Blocking Criteria

Do not launch while any of these remain unresolved:

- Authentication or session failure.
- Tenant isolation or RLS failure.
- Incorrect payment allocation or duplicate financial entries.
- Successful payment without entitlement/enrollment.
- Certificate issued without completion.
- Payout permission weakness.
- Private live recording exposed.
- AI retrieval across tenants.
- Critical checkout accessibility failure.
- No backup or rollback path.
- Critical unresolved vulnerability.

## Pre-Launch

- Domain and TLS configured.
- Production Supabase project selected.
- Migrations applied and verified.
- RLS smoke tests pass.
- Storage buckets and signed URL policies verified.
- Email sender verified.
- M-Pesa production credentials verified.
- AI provider credentials verified or AI feature flagged.
- Live provider credentials verified or live feature flagged.
- Monitoring and error reporting connected.
- Backup and restore test recorded.
- Feature flags set for pilot cohort.
- Support route and escalation owner ready.
- Legal/privacy/refund/child-safety pages reviewed.

## Smoke Tests

- Home page.
- Signup and login.
- Password reset.
- Course directory.
- Free enrollment.
- Paid checkout and callback.
- Course access.
- Quiz submission.
- Assignment upload.
- Certificate verification.
- Instructor dashboard.
- Academy dashboard.
- Enterprise dashboard.
- Live-session room.
- AI tutor.
- Subscription billing.
- Support ticket.
- Monitoring and audit log.

## Recommendation Gate

Without verified payment credentials, backup restore evidence, external monitoring, and production provider checks, the correct recommendation is controlled pilot only.
