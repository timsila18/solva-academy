# Production Implementation Prompt 5

Prompt 5 upgrades Solva Academy from learner commerce into instructor and academy operations. It preserves the approved architecture from Prompts 1-4 and does not implement enterprise learning, Solco, AI, subscriptions, scholarships, marketplace, coaching, native apps, or payout automation.

## Implemented Scope

- Production instructor workspace with dashboard, courses, learners, learner detail, assignments, quizzes, reviews, certificates, earnings, payouts, analytics, academy memberships, profile, notifications, and settings.
- Production academy workspace with dashboard, courses, learners, team, analytics, branding, revenue, payouts, certificates, reviews placeholder, policies, support, quality, and storefront settings.
- Finance admin payout review with approve, reject, clarification, paid, cancelled, and under-review states.
- Earnings ledger and payout request foundation prepared for Prompt 9.
- Grading activity foundation for assignment feedback, private grading notes, published grading, returned work, and quiz manual review.
- Tenant-aware analytics and quality metric tables.
- Public academy storefront rendering from real academy, branding, storefront, course, and membership records.
- Public instructor profile rendering from real instructor and public profile records.
- Instructor notifications table for operational notification streams.

## Database Migration

- `supabase/migrations/0005_instructor_academy_operations.sql`

New major entities:

- `earnings_ledger`
- `payout_requests`
- `payout_request_events`
- `academy_policies`
- `academy_storefront_settings`
- `instructor_public_profiles`
- `learner_course_activity_summary`
- `grading_activity`
- `academy_quality_metrics`
- `instructor_dashboard_metrics`
- `academy_dashboard_metrics`
- `instructor_notifications`

## RLS and Security

- Instructors see earnings, learners, grading, notifications, and courses only through owned or assigned course scope.
- Academy users see academy data only through owned academy or academy workspace membership.
- Finance payout management uses the normalized permission code `finance_payout.manage.platform` while the product-facing capability remains "finance.payout.manage".
- Learners do not see instructor or academy financial records.
- Payout status changes create payout request events and server actions write audit logs.

## Routes Added

- `/instructor/courses`
- `/instructor/learners`
- `/instructor/learners/[enrollmentId]`
- `/instructor/assignments`
- `/instructor/quizzes`
- `/instructor/earnings`
- `/instructor/payouts`
- `/instructor/analytics`
- `/instructor/certificates`
- `/instructor/profile`
- `/instructor/reviews`
- `/instructor/memberships`
- `/instructor/notifications`
- `/instructor/settings`
- `/academy/courses`
- `/academy/learners`
- `/academy/analytics`
- `/academy/revenue`
- `/academy/payouts`
- `/academy/policies`
- `/academy/storefront`
- `/academy/quality`
- `/academy/certificates`
- `/academy/support`
- `/admin/payouts`

## Validation

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `supabase db push --db-url $DATABASE_URL`

## Known Limitations

- Earnings entries are not automatically generated from orders yet.
- Payout automation and revenue-share calculations are deferred to Prompt 9.
- Review ratings, BI exports, learner messaging, support cases, and discussion features remain placeholders.
- Some pages use IDs where richer joined names will be added after generated Supabase types and query views are introduced.

## Deferred to Prompt 6

- Continue the approved implementation sequence without adding enterprise learning, Solco, AI, marketplace, scholarships, or native mobile functionality ahead of their prompts.
