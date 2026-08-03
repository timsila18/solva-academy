# Production Runbook

## Deployment Procedure

1. Confirm no launch blockers are open.
2. Rotate any secrets that were exposed outside secret storage.
3. Verify production environment variables with `npm run validate:env`.
4. Take a database backup or confirm point-in-time recovery is active.
5. Run migrations with `supabase db push --db-url "$DATABASE_URL"`.
6. Build the app with `npm run build`.
7. Deploy to the production hosting target for `academy.solvaone.co.ke`.
8. Run smoke tests for home, signup, login, course directory, checkout, certificate verification, AI tutor, live entry, support, billing, and monitoring.
9. Review logs, monitoring events, payment callbacks, and audit logs.
10. Keep high-risk feature flags disabled until provider verification passes.

## Rollback Procedure

- Roll back application code through the hosting platform.
- Do not reverse completed financial transactions by rolling back code.
- For database changes, prefer forward corrective migrations. Restore from backup only for unrecoverable migration failure.
- Disable affected modules with feature flags when possible.
- Pause unsafe paths using `MAINTENANCE_MODE=true` if financial integrity is at risk.
- Record the incident and audit actions.

## Incident Severity

- Critical: tenant isolation failure, auth outage, incorrect payment allocation, exposed private data, unrecoverable migration failure.
- High: failed payment callbacks, live provider outage during active class, certificate issue failure, AI cross-tenant retrieval risk.
- Medium: support backlog, delayed analytics, non-critical integration failure.
- Low: cosmetic regressions, documentation gaps, minor slow pages.

## Daily Launch Reconciliation

- Orders against payment attempts.
- Payments against enrollments and entitlements.
- Completions against certificates.
- Earnings against paid orders.
- Refunds against earnings adjustments.
- Payout approvals against payment references.
- Subscription invoices against subscription status.
- Live attendance against completion.
- Failed jobs and retries.
