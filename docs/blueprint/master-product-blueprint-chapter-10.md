# Solva Academy Master Product Blueprint

## Chapter 10: Super Admin, CMS, Platform Operations, Security, Privacy, Compliance, Analytics, Search, Notifications, Testing, Deployment, Support, Governance, and Final Blueprint Consolidation

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Final product and system blueprint. No production application code.

---

## 1. Executive Summary

Solva Academy is a standalone learning, teaching, academy-building, employer-training, marketplace, live-class, AI, skills, payments, and opportunity platform within the Solva ecosystem. Chapters 1 through 9 define the vision, identity, learning engine, learner experience, instructor economy, enterprise learning, Solco live classroom, AI architecture, and financial system. Chapter 10 completes the Master Product Blueprint by defining how the whole platform is administered, configured, secured, monitored, supported, tested, deployed, governed, and evolved.

This chapter is not a generic admin summary. It defines the operational architecture required to run Solva Academy at national scale: Super Admin, CMS, taxonomy, users, academies, instructors, courses, reviews, organizations, Solco, AI, finance, scholarships, trust and safety, child safeguarding, support, search, recommendations, notifications, analytics, audit, security, privacy, accessibility, legal readiness, reliability, observability, backups, performance, background jobs, integrations, APIs, mobile readiness, SEO, environments, secrets, deployment, migrations, testing, governance, documentation, seed strategy, launch readiness, blueprint consolidation, MVP scope, post-MVP phases, and the ten implementation prompts that should follow.

The final direction is clear: build Solva Academy as a Kenyan-first and Africa-ready platform where people can learn, teach, build academies, train organizations, earn income, practice with Solva tools, attend live Solco classes, receive verified credentials, and use AI responsibly without making AI the whole product.

---

## 2. Chapter Objectives

This chapter defines:

- Super Admin experience.
- Platform administration.
- Configurable CMS.
- Homepage and discovery management.
- Taxonomy administration.
- User administration.
- Academy and instructor governance.
- Enterprise account management.
- Course review operations.
- Trust and safety.
- Child safeguarding.
- Finance administration.
- AI administration.
- Solco administration.
- Support operations.
- Search architecture.
- Notification architecture.
- Analytics and reporting.
- Audit trails.
- Security architecture.
- Privacy and data protection.
- Accessibility governance.
- Legal and compliance readiness.
- Content governance.
- Platform reliability.
- Observability.
- Backup and disaster recovery.
- Performance.
- Testing strategy.
- Deployment strategy.
- Environment management.
- Domain strategy.
- Integration governance.
- Mobile readiness.
- Product governance.
- Release management.
- Final blueprint consolidation.
- Production implementation roadmap.

---

## 3. Super Admin Philosophy

The Super Admin must operate Solva Academy without requiring developers for ordinary business configuration.

The guiding principle remains:

> Nothing should be hardcoded unless there is a strong security, integrity, legal, or technical reason.

Super Admin capabilities should be:

- Powerful.
- Searchable.
- Auditable.
- Permission-controlled.
- Safe from accidental actions.
- Designed for scale.
- Suitable for delegation.
- Protected by re-authentication for sensitive operations.

Administration should be organized into clear operational domains, not one overcrowded dashboard.

---

## 4. Founding Super Admin Protection

The founding account remains:

**Name:** Timothy Sila  
**Email:** `timsila18@gmail.com`

This account must retain protected Founding Super Admin status and support role/workspace switching across:

- Founding Super Admin.
- Platform Administrator.
- Tutor.
- Student.
- Academy Owner.
- Reviewer.
- Moderator.
- Finance Viewer.
- Employer User.
- Corporate Trainer.
- Support Agent.
- Platform Tester.

Protect the account from accidental deletion, accidental suspension, accidental demotion, role removal, lockout, and unauthorized ownership transfer.

Sensitive actions involving this account must require:

- Re-authentication.
- MFA where enabled.
- Explicit confirmation.
- Audit log.
- Recovery method.
- Emergency ownership procedure.

Do not rely only on matching an email string in frontend code. Protection should be enforced by database-backed protected role assignments, server-side authorization, and guarded administrative procedures.

---

## 5. Administration Information Architecture

The Super Admin console should be organized around major domains:

1. Platform Overview.
2. Users and Identity.
3. Roles and Permissions.
4. Schools and Taxonomy.
5. Academies.
6. Instructors.
7. Courses and Learning Products.
8. Reviews and Approvals.
9. Learners.
10. Organizations and Enterprise.
11. Solco Live Learning.
12. Communities and Messaging.
13. Marketplace.
14. Certificates and Credentials.
15. Skills and Learning Paths.
16. AI Administration.
17. Finance and Payments.
18. Scholarships and Sponsorships.
19. Affiliates and Promotions.
20. CMS and Website.
21. Search and Discovery.
22. Notifications.
23. Trust and Safety.
24. Child Safety.
25. Support Operations.
26. Analytics and Reports.
27. Audit Logs.
28. Integrations.
29. Security and Privacy.
30. Platform Settings.
31. System Health.
32. Release Management.

Each domain should have clear navigation, filters, saved views, bulk actions, exports, and permission boundaries.

---

## 6. Platform Dashboard

The platform overview should show:

- Registered users.
- Active learners.
- Active instructors.
- Active academies.
- Published courses.
- Courses under review.
- Live classes today.
- Current Solco attendance.
- Active organizations.
- Enrollments.
- Course completion.
- Gross sales.
- Platform revenue.
- Pending payouts.
- Refunds.
- Scholarship learners.
- Sponsor-funded learners.
- AI usage.
- AI spend.
- Support tickets.
- Moderation reports.
- Child safety alerts.
- System incidents.
- Payment provider status.
- Search health.
- Storage usage.
- Platform availability.

Allow date filters, workspace filters, country filters, school filters, and trend comparisons. High-risk alerts should be visible without dominating ordinary operations.

---

## 7. CMS

Solva Academy needs a full CMS for public and logged-in platform content.

CMS-managed content should include:

- Homepage.
- About page.
- How it works.
- Become an Instructor page.
- Start Your Academy page.
- Employer page.
- School pages.
- Academy discovery pages.
- Course discovery pages.
- Scholarship pages.
- Sponsorship pages.
- Help centre.
- Pricing pages.
- Legal pages.
- Promotional landing pages.
- Campaign pages.
- Blog or learning articles.
- FAQ.
- Platform announcements.
- Testimonials.
- Case studies.
- Footer content.
- Navigation menus.

Support draft, review, scheduled publication, published, unpublished, archived, versioning, preview, SEO, multilingual variants, page ownership, and approval workflows.

---

## 8. Homepage and Navigation Management

Super Admin should configure homepage sections without code.

Possible sections:

- Hero.
- Search.
- Featured schools.
- Featured academies.
- Trending courses.
- New courses.
- Free courses.
- Affordable courses.
- Live now.
- Upcoming events.
- Learning paths.
- Top instructors.
- Employer training.
- Children’s learning.
- Scholarships.
- Sponsor a learner.
- Solva practical labs.
- Testimonials.
- Platform impact.
- Become an instructor.
- Start an academy.
- Mobile learning.
- Corporate inquiry.
- Newsletter or updates.

Each section should support enable/disable, reorder, title, subtitle, data source, manual selection, automatic selection, audience rules, country targeting, language, start/end date, device-specific display, and future experiment variants.

Navigation management should cover public, learner, tutor, academy owner, enterprise, parent, admin, footer, mobile, and help menus. Protected navigation items required for safety or account access should not be removable.

---

## 9. Taxonomy Administration

Super Admin should manage:

- Schools.
- Categories.
- Subcategories.
- Subjects.
- Topics.
- Skills.
- Tags.
- Levels.
- Age groups.
- Languages.
- Course types.
- Learning formats.
- Academy types.
- Organization types.
- Session types.
- Credential types.
- Marketplace categories.

Support create, edit, merge, reorder, redirect, hide, archive, retire, restore, reviewer rules, risk classification, AI policy, certificate policy, and child safety policy.

Merging taxonomy must preserve historical references and redirects.

---

## 10. Feature Flags

Create feature flags for platform-wide, role-specific, academy-specific, organization-specific, country-specific, beta, internal testing, percentage rollout, user allowlist, workspace allowlist, and emergency shutdown cases.

Examples:

- AI Mentor.
- Solco recording.
- Marketplace.
- Custom domains.
- Affiliate program.
- Child communities.
- Advanced wallets.
- Multi-currency.
- Career opportunities.
- New course builder.
- New search engine.

Feature flags must be server-enforced where security matters.

---

## 11. User Administration

Authorized administrators should search users, filter by status, view profile, roles, workspaces, academies, organizations, enrollment summary, verification status, support history, moderation history, audit trail, and authorized exports.

They may suspend, restrict, reactivate, verify, invite, resend verification, reset access where lawful, process deletion requests, and process correction requests.

Sensitive private data should remain masked unless role permissions allow access.

---

## 12. Roles and Permissions

Manage platform roles, academy roles, organization roles, course roles, temporary roles, permission groups, role templates, permission dependencies, scope, inheritance, overrides, expiry, and delegation.

Support:

- Create custom role.
- Duplicate role.
- Compare roles.
- Preview effective permissions.
- Detect dangerous permission combinations.
- Require approval for high-risk role changes.
- Roll back changes.
- Audit every assignment.

Role and permission management must preserve the one-account, multiple-capabilities model established in Chapter 2.

---

## 13. Academy Administration

Super Admin should manage academy applications, status, ownership, co-owners, staff, verification, branding, public page, custom domain requests, revenue rules, payout restrictions, course catalogue, reviews, complaints, support cases, quality score, suspension, appeal, closure, and ownership transfer.

Academy actions must preserve learner access, financial records, certificates, and historical data where appropriate.

---

## 14. Instructor Administration

Manage instructor applications, verification levels, documents, expertise, sample lessons, instructor badges, training requirements, child-teaching approval, course assignments, academy memberships, payout status, complaints, reputation indicators, suspension, reinstatement, appeals, and instructor success programs.

Do not expose verification documents beyond authorized reviewers.

---

## 15. Course Review Operations

Create operational queues for:

- New course review.
- Course update review.
- High-risk course review.
- AI-generated content review.
- Certificate review.
- Child course review.
- Regulatory update review.
- Copyright review.
- Technical quality review.
- Marketplace product review.

Reviewer workspace should support assignment, priority, due date, checklist, rubric, comments, evidence, changes requested, approval, conditional approval, rejection, escalation, and conflict declaration.

Review service-level targets should track queue age, assigned reviewer, time to first action, time to resolution, reopened cases, escalation, and breached targets. Do not promise unrealistic public timelines.

---

## 16. Enterprise Administration

Manage organization applications, plans, contracts, seats, active learners, billing, SSO, integrations, internal academies, organization administrators, data imports, compliance programs, usage, support level, renewal, suspension, cancellation, data export, and archive.

Provide both a global enterprise view and organization-level details.

---

## 17. Solco Administration

Manage live session types, session limits, recording settings, retention, host permissions, waiting room defaults, attendance rules, child safety defaults, moderation, session incidents, recording failures, provider or infrastructure status, storage consumption, session analytics, live feature flags, and emergency room shutdown.

Maintain clear boundaries between Solco infrastructure and Academy course data.

---

## 18. AI Administration

Build on Chapter 8. Manage AI providers, models, feature availability, routing, quotas, prompts, prompt versions, source trust, knowledge bases, course AI settings, academy AI settings, organization AI settings, child AI restrictions, high-stakes restrictions, cost budgets, usage, quality evaluations, safety incidents, provider outage, model retirement, data retention, and human-review requirements.

AI administration must support immediate feature shutdown.

---

## 19. Finance Administration

Build on Chapter 9. Manage payment providers, orders, payments, unmatched payments, refunds, disputes, revenue allocations, earnings, wallets, payouts, reserves, taxes, withholding, subscriptions, memberships, enterprise invoices, scholarship funds, sponsor funds, affiliates, reconciliation, financial periods, adjustments, reports, and risk flags.

Sensitive actions must use segregation of duties.

---

## 20. Scholarships and Sponsorships

Manage programs, funding source, budget, eligibility, applications, review panels, awards, progress, withdrawals, fraud flags, sponsor reports, remaining funds, outcome reporting, privacy, and appeals.

Support bulk awards and cohort programs with audit controls.

---

## 21. Trust and Safety

Create queues and workflows for user reports, course reports, academy reports, instructor misconduct, harassment, fraud, spam, unsafe messaging, off-platform payment pressure, fake qualifications, review manipulation, academic integrity, copyright, child safety, live-class incidents, and AI safety incidents.

Each case should support severity, category, reporter, subject, evidence, assigned investigator, status, temporary safety action, decision, appeal, and audit trail.

---

## 22. Child Safeguarding

Create a dedicated safeguarding domain, separate from ordinary support queues.

Support:

- Priority queue.
- Restricted access.
- Safeguarding officer role.
- Parent or guardian contact workflow.
- Tutor restriction.
- Session preservation.
- Evidence preservation.
- Emergency escalation.
- Reporting obligations by jurisdiction.
- Internal review.
- Appeal where appropriate.
- Confidentiality.
- Need-to-know access.

Child safety is a non-negotiable platform requirement.

---

## 23. Community and Messaging Administration

Manage communities, moderators, posts, reports, messaging restrictions, user blocks, child messaging, automated spam controls, retention, export requests, abuse patterns, announcements, and archived communities.

Platform moderators should have scoped, logged access.

---

## 24. Support Operations

Support categories include account, course, payment, payout, certificate, Solco, AI, enterprise, academy, instructor, child safety, accessibility, refund, scholarship, sponsorship, marketplace, technical issue, privacy request, and legal complaint.

Support tickets should include ticket number, priority, category, user, workspace, assigned agent, status, SLA target, internal notes, user-visible messages, attachments, escalation, resolution, satisfaction rating, and audit trail.

---

## 25. Help Centre

Create a searchable help centre for learners, parents, instructors, academy owners, employers, corporate learners, reviewers, finance users, and admins.

Support articles, guides, videos, FAQs, troubleshooting, release notes, known issues, category pages, search, feedback, article versioning, multilingual content, and role-specific visibility.

---

## 26. Notification Architecture

Centralized notifications should support in-app, email, SMS, push, future WhatsApp, calendar, and enterprise webhooks.

Notification sources include courses, assignments, Solco, payments, payouts, subscriptions, communities, AI, enterprise, scholarships, support, safety, admin, and marketing.

Support template management, variables, language, audience, priority, delivery schedule, quiet hours, digests, retry, failure handling, opt-in, opt-out, mandatory notices, and delivery logs.

Communication consent should separate transactional messages, course messages, tutor announcements, enterprise assignments, marketing, product updates, scholarship updates, sponsor communications, and community notifications.

---

## 27. Search Architecture

Search should cover courses, academies, instructors, schools, learning paths, skills, live classes, events, marketplace products, help centre, authorized communities, enterprise internal content, and admin resources.

Support keyword search, natural-language search, filters, facets, sorting, typo tolerance, synonyms, Kiswahili terms, recent searches, saved searches, suggestions, role-aware results, permission-aware results, and low-latency mobile experience.

---

## 28. Recommendation Governance

Recommendations should be explainable, role-aware, age-aware, budget-aware, language-aware, quality-aware, and not solely revenue-driven.

Super Admin should manage eligibility, diversity rules, sponsored placements, safety exclusions, new-course treatment, low-quality exclusion, child recommendations, and enterprise recommendations.

Sponsored results must be labelled. Search relevance should not be fully purchasable.

---

## 29. Analytics Architecture

Create event-based analytics for registration, onboarding, search, course view, enrollment, payment, lesson start, lesson completion, quiz, assignment, Solco attendance, AI usage, certificate, marketplace, coaching, community, enterprise assignment, support, refund, payout, scholarship, and sponsor impact.

Events should include user where lawful, workspace, tenant, timestamp, source, device class, country, feature, object ID, outcome, and privacy-safe metadata.

Analytics must respect role permissions, tenant isolation, child privacy, and enterprise data boundaries.

---

## 30. Reporting Engine

Reports should serve platform, academy, instructor, learner, parent, organization, sponsor, finance, support, and compliance users.

Support:

- Interactive dashboards.
- Saved reports.
- Scheduled reports.
- PDF export.
- CSV export.
- Excel export.
- Date filters.
- Tenant filters.
- Permission-aware row access.
- Report generation logs.

Reports must clearly show data coverage and generation date.

---

## 31. Audit Architecture

Audit logs should record sign-ins, role changes, permission changes, admin configuration, course review, academy review, instructor verification, payments, refunds, payouts, scholarships, support access, Solco moderation, AI usage, data exports, privacy requests, child safety actions, and high-risk settings.

Audit records should include actor, action, resource, previous value, new value, timestamp, workspace, tenant, IP/device where appropriate, reason, correlation ID, and risk level.

Audit logs should be append-oriented and protected from casual editing.

---

## 32. Security Architecture

Security must include secure authentication, MFA readiness, role-based access, permission scopes, Row Level Security, server-side authorization, tenant isolation, secure sessions, CSRF protection where relevant, rate limiting, file access control, webhook verification, secrets management, audit logs, secure error handling, and security monitoring.

High-risk actions should require re-authentication and, where configured, dual approval.

---

## 33. Tenant Isolation

Tenant isolation is mandatory across academies, organizations, internal courses, finance records, files, reports, AI retrieval, Solco recordings, communities, messages, support records, and analytics.

Use tenant IDs, workspace IDs, scoped role assignments, RLS, server authorization, signed file URLs, permission-aware search indexes, and audit logs.

Never rely only on frontend hiding.

---

## 34. File Security

Files include videos, PDFs, images, certificates, assignments, verification documents, payout documents, policy documents, Solco recordings, transcripts, AI artifacts, and marketplace downloads.

Requirements:

- Tenant-aware storage paths.
- Signed URLs.
- Expiry.
- Download controls.
- Malware scanning future readiness.
- File type restrictions.
- Size limits.
- Access logs for sensitive files.
- Retention rules.
- Private-by-default sensitive uploads.

---

## 35. Privacy and Data Protection

Privacy architecture should support public profile controls, certificate visibility, employer visibility, child privacy, support access controls, data exports, correction requests, deletion requests, anonymization, consent records, communication preferences, AI conversation transparency, and financial data masking.

Organizations must not automatically see personal learning. Academy owners must not see unrelated learner data. AI must not retrieve beyond permissions.

---

## 36. Data Retention

Define retention for accounts, profiles, enrollments, certificates, payments, tax records, support tickets, audit logs, AI conversations, Solco recordings, messages, child records, scholarship applications, and enterprise reports.

Retention should support legal obligations, user privacy, child protection, financial audit, and operational need. Deletion should use anonymization or tombstones where records must remain for integrity.

---

## 37. Accessibility Governance

Accessibility should be governed across design, development, content, media, live classes, certificates, reports, and support.

Require keyboard navigation, screen reader labels, captions, transcripts, contrast, reduced motion, text scaling, alt text, clear errors, accessible forms, mobile touch targets, and accessible support routes.

Accessibility should be part of QA gates, not a post-launch patch.

---

## 38. Legal and Policy Requirements

Required policies and legal documents include terms of service, privacy policy, child safety policy, instructor agreement, academy agreement, enterprise agreement, refund policy, payment terms, scholarship terms, sponsor terms, affiliate terms, content policy, copyright policy, acceptable use policy, AI use policy, certificate policy, community rules, data processing terms, and accessibility statement.

Legal and compliance reviewers should approve public claims, certificates, CPD claims, tax rules, child safety rules, and enterprise terms.

---

## 39. Content Governance

Content governance should cover course quality, copyright, instructor claims, child suitability, AI-generated content, professional sensitivity, source freshness, accessibility, pricing fairness, certificate suitability, marketplace products, and regulatory update review.

High-risk subjects such as HR, payroll, law, health, finance, child safety, and government compliance require stronger review.

---

## 40. Certificate Governance

Certificate governance should define credential types, templates, issuance rules, verification, revocation, expiry, renewal, QR codes, platform verified status, academy branding, professional claims, CPD conditions, and audit logs.

Certificates should represent verified completion or achievement, not vague marketing claims.

---

## 41. Reliability

Reliability requirements include graceful degradation, provider outage handling, payment retry, AI fallback, Solco failure recovery, database backups, queue retries, idempotent webhooks, clear user messaging, and incident response.

Solva Academy must remain usable when AI, payment providers, Solco, email, or SMS experience partial outages.

---

## 42. Observability

Observability should include application logs, structured events, error tracking, performance monitoring, uptime checks, queue monitoring, payment callback monitoring, AI gateway monitoring, Solco integration monitoring, search health, storage usage, database metrics, and alerting.

Dashboards should separate product analytics from engineering health.

---

## 43. Incident Management

Define incidents for security, privacy, child safety, payment failures, AI safety, Solco outages, data corruption, provider outages, search failures, deployment failures, and legal complaints.

Incident workflow:

1. Detect.
2. Triage.
3. Contain.
4. Assign owner.
5. Communicate internally.
6. Fix or mitigate.
7. Communicate externally where needed.
8. Review impact.
9. Write post-incident review.
10. Prevent recurrence.

---

## 44. Backup and Disaster Recovery

Backups should cover database, file storage metadata, critical files, configuration, secrets references, search indexes rebuild strategy, and audit logs.

Define RPO, RTO, backup frequency, restore testing, point-in-time recovery, offsite backups where appropriate, backup access controls, and disaster recovery runbooks.

---

## 45. Performance

Performance should be mobile-first and low-data conscious.

Targets should cover page load, API response, search latency, video startup, low-bandwidth modes, dashboard queries, admin list filtering, report generation, Solco join flow, checkout, payment verification, and AI response times.

Use caching, pagination, background jobs, CDN media, image optimization, database indexes, and query monitoring.

---

## 46. Background Jobs

Background jobs should handle email/SMS sending, report generation, media processing, certificate generation, AI indexing, AI summaries, payment reconciliation, payout processing, subscription renewal, reminder delivery, search indexing, cleanup tasks, analytics aggregation, and Solco recording processing.

Jobs require retries, idempotency, failure queues, monitoring, and audit where relevant.

---

## 47. Integration Governance

Integrations include SolvaOne, Solco, Solva HR, payments, email, SMS, AI providers, storage, search, calendars, Google, Microsoft, HRIS, ERP, school systems, webhooks, and future Solva products.

Each integration needs owner, purpose, data exchanged, authentication method, scopes, rate limits, failure handling, audit logs, disconnect process, and privacy review.

---

## 48. API Architecture

APIs should be modular, versionable, permission-aware, tenant-aware, documented, and ready for web, mobile, integrations, and future partners.

API domains should include identity, users, roles, taxonomy, academies, courses, enrollments, progress, certificates, payments, enterprise, Solco, AI, marketplace, search, notifications, support, analytics, and admin configuration.

All sensitive API actions must enforce server-side authorization.

---

## 49. Mobile Readiness

Even if launch is web-first, the system should be mobile-app ready.

Requirements:

- Token-based auth readiness.
- API-first learning flows.
- Offline lesson planning.
- Download entitlements.
- Push notification readiness.
- Background audio future support.
- Low-data media variants.
- Progress sync.
- Mobile Solco join flow.
- Parent-child management.
- Secure local storage strategy.

---

## 50. SEO

SEO should support public pages for schools, academies, courses, instructors, learning paths, marketplace products, events, articles, scholarships, and employer pages.

Support metadata, canonical URLs, structured data where appropriate, sitemaps, robots controls, redirects, localized pages, fast rendering, social sharing cards, and public/private visibility rules.

---

## 51. Domain Strategy

Primary production domain: `academy.solvaone.co.ke`.

Future domain capabilities:

- Academy paths such as `/academy/timothy-sila-hr`.
- Optional academy subdomains.
- Premium custom domains.
- Enterprise private paths.
- Redirect management.
- SSL.
- Domain verification.
- Reserved slugs.

Domain strategy should preserve Solva Academy as standalone while connected to the Solva ecosystem.

---

## 52. Environment Strategy

Use separate environments:

- Local development.
- Preview.
- Staging.
- Production.

Each environment should have separate database, storage, secrets, payment credentials, AI credentials, Solco credentials, email/SMS settings, feature flags, seed data, and monitoring.

Production data should not be casually copied into lower environments.

---

## 53. Secrets Management

Secrets include database keys, service-role keys, payment credentials, M-Pesa keys, AI keys, email credentials, SMS credentials, Solco credentials, signing secrets, and webhook secrets.

Requirements:

- Environment variables.
- Secret manager.
- No frontend exposure.
- Rotation.
- Restricted access.
- Audit.
- Emergency revocation.
- Separate environments.

Never commit secrets to the repository.

---

## 54. Deployment Strategy

Recommended deployment approach:

- Vercel or compatible platform for Next.js frontend and server functions.
- Supabase or compatible PostgreSQL backend.
- Managed object storage.
- Background worker infrastructure.
- Search service where needed.
- Solco service integration.
- CDN for media.
- Separate processing for heavy media and AI jobs.

Define build, migrations, seed data, deployment approval, preview deployments, staging verification, production release, rollback, post-release checks, and incident rollback.

---

## 55. Database Migrations

Require version-controlled migrations, forward migration, rollback planning, data backfills, migration testing, RLS testing, index review, production-safe migration, long-running migration plan, schema documentation, seed configuration, and no destructive manual production editing.

Migrations touching finance, identity, tenant isolation, child safety, or certificates require extra review.

---

## 56. Testing Strategy

Testing should include:

- Unit tests.
- Integration tests.
- API tests.
- Database tests.
- RLS tests.
- Permission tests.
- Authentication tests.
- Payment tests.
- Webhook tests.
- AI gateway tests.
- AI evaluation tests.
- Solco integration tests.
- Search tests.
- Notification tests.
- Accessibility tests.
- Responsive tests.
- Performance tests.
- Security tests.
- Tenant-isolation tests.
- Financial-ledger tests.
- Certificate tests.
- Child-safety tests.
- End-to-end tests.
- Regression tests.
- Smoke tests.

---

## 57. Critical End-to-End Journeys

Test these full journeys:

- Learner: Register -> Discover course -> Pay by M-Pesa -> Enroll -> Learn -> Take quiz -> Join Solco class -> Complete -> Receive certificate.
- Parent: Register -> Create child profile -> Buy music course -> Approve live class -> View progress -> Receive certificate.
- Instructor: Apply -> Get approved -> Create academy -> Create course -> Submit review -> Publish -> Earn -> Request payout.
- Employer: Register organization -> Import staff -> Assign course -> Track completion -> Export report -> Renew subscription.
- Scholarship: Create program -> Apply -> Review -> Award -> Enroll -> Track completion -> Sponsor report.
- AI: Ask course question -> Retrieve authorized sources -> Answer with source grounding -> Log usage -> Accept feedback.
- Finance: Create order -> Receive payment callback -> Create entitlement -> Allocate revenue -> Refund -> Reverse allocations.
- Safety: Report misconduct -> Triage -> Temporary restriction -> Investigation -> Decision -> Appeal.

---

## 58. Permission and Tenant Test Matrix

Test:

- Student cannot view another student’s private activity.
- Academy A cannot view Academy B’s financial data.
- Organization A cannot view Organization B’s employees.
- Instructor only sees assigned-course learners.
- Parent sees linked child only.
- Child cannot access restricted messaging.
- Finance officer cannot edit courses.
- Content manager cannot approve payouts.
- Reviewer cannot access unrelated financial data.
- Support impersonation is time-limited and logged.
- AI retrieval cannot cross workspace boundaries.
- Solco recording access respects course and organization rules.

---

## 59. Financial Tests

Test duplicate callbacks, delayed callbacks, underpayment, overpayment, duplicate payment, failed STK, refund, partial refund, revenue split, multi-instructor split, payout, failed payout, reserve, subscription renewal, coupon funding source, scholarship credit, sponsor fund, reconciliation, manual adjustment, and future currency rounding.

Ledger balance must remain consistent.

---

## 60. AI Tests

Test grounding, citation, permission boundaries, prompt injection, cross-tenant extraction, quiz-answer restrictions, high-stakes escalation, child responses, cost limits, provider failure, invalid structured output, hallucinated sources, tool confirmation, deletion and retention, model fallback, and quality evaluations.

---

## 61. Solco Tests

Test session scheduling, eligibility, waiting room, join, rejoin, attendance, host controls, recording permission, child restrictions, corporate session, cancellation, reschedule, recording access, AI notes, session failure, mobile, and low-bandwidth use.

---

## 62. Accessibility Tests

Test keyboard-only navigation, focus order, screen-reader labels, form errors, captions, transcript access, contrast, text scaling, reduced motion, touch target size, mobile orientation, and accessible certificates and reports where feasible.

---

## 63. Quality Gates

Before a feature is production-ready, require acceptance criteria passed, permission review, tenant-isolation review, accessibility review, security review, analytics events, audit events, error states, loading states, empty states, mobile validation, low-data review where relevant, documentation, support article, release note, and rollback plan.

Finance, child safety, AI, and identity features require additional review.

---

## 64. Release Management

Support release planning, feature flags, preview deployment, staging, QA sign-off, security sign-off, product sign-off, migration plan, communication, production deployment, smoke test, monitoring, rollback, and post-release review.

Use phased rollout for high-risk features.

---

## 65. Product Governance

Create governance responsibilities for product, engineering, learning quality, instructor success, enterprise learning, finance, trust and safety, child safeguarding, AI governance, privacy, security, support, legal, and accessibility.

Define who can approve new schools, high-risk course categories, new payment providers, new AI providers, child communication changes, certificate claims, revenue share changes, enterprise data integrations, and major policy changes.

---

## 66. Operational Runbooks

Create runbooks for approving instructors, approving academies, reviewing courses, processing refunds, processing payouts, reconciling M-Pesa, handling unmatched payments, handling account takeover, handling child safety reports, handling copyright complaints, handling AI incidents, handling Solco recording issues, suspending academies, restoring accounts, processing privacy requests, enterprise onboarding, scholarship awards, sponsor reporting, and production deployment.

---

## 67. Documentation Requirements

Maintain product documentation, architecture documentation, database documentation, API documentation, permission catalogue, role catalogue, event catalogue, financial rules, AI prompt and model registry, integration registry, runbooks, support guides, admin guides, instructor guides, enterprise guides, release notes, known issues, and security procedures.

Documentation must evolve with the product.

---

## 68. Seed and Configuration Strategy

Initial seed configuration should include:

- Founding Super Admin.
- Initial platform roles.
- Initial permissions.
- Initial schools.
- Initial categories.
- Initial learning formats.
- Initial age groups.
- English.
- Kiswahili readiness.
- Kenyan Shilling.
- Initial payment methods.
- Initial course statuses.
- Initial approval workflows.
- Initial certificate types.
- Initial support categories.
- Initial moderation categories.
- Initial feature flags.
- Initial notification templates.

Seed data should be editable through Admin after installation.

---

## 69. Initial Schools

Recommended launch schools:

- Human Resources.
- Music.
- Dance.
- Academic Tutoring.
- Business and Entrepreneurship.
- Technology and AI.

Super Admin must be able to add more without code. Do not launch an empty catalogue across too many schools.

---

## 70. Initial Academies and Content

Recommended launch academies:

- Timothy Sila HR Academy.
- The sister’s music academy.
- The tutoring academy.
- Yvonne’s dance academy.

Final public academy names must be entered through Admin and academy setup workflow rather than hardcoded in application components.

Launch should be quality-first with a focused course catalogue.

---

## 71. Initial HR Catalogue

Recommended initial HR offerings:

- Introduction to Human Resource Management.
- Kenyan Labour Law Fundamentals.
- Practical Payroll Processing.
- PAYE Fundamentals.
- SHIF Administration.
- NSSF Administration.
- HRIS Fundamentals.
- Recruitment and Selection.
- Performance Management.
- Disciplinary Procedures.
- Leave Administration.
- Employee Records.
- HR Reporting.
- Complete HR Professional Learning Path.

Course details, prices, and publication should remain configurable.

---

## 72. Launch Readiness

Before public launch, verify:

- Domain configured.
- Authentication working.
- Founding Admin protected.
- Core roles and permissions.
- Academy creation.
- Course builder.
- Course review.
- Learner enrollment.
- M-Pesa checkout.
- Entitlements.
- Course playback.
- Progress.
- Quiz.
- Solco class.
- Attendance.
- Certificate.
- Instructor earnings.
- Payout workflow.
- Enterprise workspace.
- Parent-child flow.
- AI Tutor.
- Support.
- Moderation.
- Privacy pages.
- Legal review.
- Security review.
- Accessibility review.
- Backups.
- Monitoring.
- Incident plan.
- Production support.

---

## 73. Master Blueprint Consolidation

The ten chapters consolidate into one product direction:

- **Product vision:** Africa-ready learning ecosystem rooted in practical outcomes.
- **Core differentiators:** Academies as businesses, Solco live classes, AI assistance, practical Solva labs, verified skills, Kenyan affordability, enterprise learning, and instructor monetization.
- **User groups:** Learners, parents, children, instructors, academy owners, employers, schools, NGOs, churches, SACCOs, government, sponsors, reviewers, moderators, finance, support, and Super Admin.
- **Roles:** One account can hold many scoped roles.
- **Tenant model:** Academies and organizations are isolated workspaces with platform governance.
- **Course engine:** Flexible curriculum, lessons, assessments, labs, certificates, marketplace products.
- **Learner experience:** Personalized, low-data, accessible, goal-oriented, AI-assisted, human-supported.
- **Instructor business system:** Course creation, live teaching, analytics, revenue, marketing, payouts.
- **Enterprise learning:** Assignments, compliance, internal academies, skills tracking, reports.
- **Solco:** Native live classroom and collaboration layer.
- **AI:** Modular, grounded, permission-aware, provider-agnostic assistance.
- **Finance:** M-Pesa-first, transparent, auditable, provider-independent financial system.
- **Admin:** Configurable operational control centre.
- **Security:** Tenant isolation, RLS, audit logs, privacy, child safety, and secure operations.
- **Future roadmap:** MVP first, then memberships, subscriptions, advanced AI, mobile apps, shared Solva wallet, multi-currency, and opportunity marketplace.

---

## 74. Conflict and Gap Analysis

### Resolved Duplicates

Repeated requirements across chapters are intentional product principles: configurability, tenant isolation, audit logs, child safety, AI human accountability, M-Pesa readiness, and Solco integration.

### Potential Conflicts

- **Configurability vs safety:** Resolve by allowing admin configuration but protecting security-critical settings with approvals, guarded defaults, and audit logs.
- **Employer visibility vs learner privacy:** Resolve by separating corporate-assigned learning from personal learning.
- **AI assistance vs academic integrity:** Resolve with course-level AI rules, declarations, and human review for high-stakes work.
- **Affordable prices vs platform costs:** Resolve with pricing warnings, scholarships, sponsor funding, and cost-aware product types.

### Deferred Decisions

Implementation should decide exact payment providers, hosting details, legal policy wording, tax treatment, final initial prices, exact Solco API contracts, AI provider mix, and accreditation/CPD claims after review.

---

## 75. Final Non-Negotiables

1. Standalone `solva-academy` project.
2. Production domain `academy.solvaone.co.ke`.
3. Separate from SolvaOne document creation.
4. Future shared identity with Solva ecosystem.
5. One account can hold multiple roles.
6. Founding account is `timsila18@gmail.com`.
7. Multi-tenant academies and organizations.
8. Admin configurability over hardcoding.
9. Kenyan-first and Africa-ready.
10. Mobile-first and low-data conscious.
11. M-Pesa-first financial experience.
12. Solco as native live-class layer.
13. AI assists but does not replace accountable humans.
14. Practical learning through Solva product labs.
15. Strong child safety.
16. Transparent instructor and academy earnings.
17. Affordable employer adoption.
18. Verified outcomes over passive video completion.
19. Strict tenant isolation.
20. Platform remains useful during AI or provider outages.

---

## 76. MVP Definition

Realistic production MVP:

- Authentication.
- Multi-role accounts.
- Founding Admin.
- Schools and categories.
- Academy application and creation.
- Instructor application.
- Course builder.
- Lessons.
- Video, audio, text, PDF.
- Quizzes.
- Assignments.
- Course review.
- Learner dashboard.
- Enrollment.
- M-Pesa checkout.
- Entitlements.
- Progress tracking.
- Certificates.
- Solco live sessions.
- Attendance.
- Basic AI Tutor.
- Basic AI Course Creator.
- Instructor earnings.
- Manual payout workflow.
- Basic enterprise workspace.
- Staff import.
- Course assignment.
- Completion reports.
- Parent and child profiles.
- Basic marketplace resources.
- Admin console.
- Support.
- Moderation.
- Audit logs.
- Notifications.
- Analytics.
- Security and backups.

Features that should not delay MVP include shared Solva wallet, multi-currency, custom domains, advanced affiliate program, advanced AI Mentor, employer talent pool, mobile apps, large events, white-label enterprise, CPD partnerships, and advanced simulations.

---

## 77. Post-MVP Phases

### Phase 2

- Memberships.
- Subscriptions.
- Advanced enterprise.
- AI Mentor.
- AI Career Coach.
- Affiliate program.
- Sponsorship dashboard.
- Scholarships.
- Coaching.
- Events.
- Advanced Solco tools.
- Advanced community.
- Mobile apps.
- Solva HR integration.

### Phase 3

- Shared Solva wallet.
- Multi-currency.
- Regional mobile money.
- Custom academy domains.
- Advanced skills passport.
- Employer talent pool.
- Job and internship marketplace.
- CPD partnerships.
- White-label enterprise.
- Advanced simulations.
- Multilingual AI.
- Advanced product labs.
- Large public events.

---

## 78. Ten-Prompt Production Implementation Plan

### Implementation Prompt 1

**Objectives:** Initialize project architecture and core identity foundation.  
**Features:** Next.js app, design system, environments, auth foundation, Founding Admin bootstrap, shared layouts, role/workspace switcher.  
**Database work:** Base users, profiles, roles, permissions, workspaces, audit tables, seed Founding Admin.  
**API work:** Auth/session helpers, role lookup, workspace context.  
**UI work:** App shell, login/register, account menu, switcher, admin skeleton.  
**Permissions:** Super Admin protection and base permission checks.  
**Audit:** Sign-in, role changes, admin bootstrap.  
**Tests:** Auth, RLS, role switching, Founding Admin protection.  
**Acceptance:** Founding Admin can sign in and switch contexts safely.  
**Dependencies:** Supabase or equivalent configured.  
**Out of scope:** Course builder, payments, AI.

### Implementation Prompt 2

**Objectives:** Build taxonomy, applications, academies, organizations, and permissions.  
**Features:** Schools, categories, academy applications, instructor applications, academy creation, teams, organization creation.  
**Database work:** Taxonomy, academy, instructor, organization, memberships, applications.  
**API work:** CRUD with approval workflows.  
**UI work:** Admin taxonomy, application forms, academy setup, organization setup.  
**Permissions:** Scoped academy and organization roles.  
**Audit:** Application status changes and team changes.  
**Tests:** Tenant isolation and workflow status transitions.  
**Acceptance:** Admin can approve an instructor and academy.  
**Dependencies:** Prompt 1.  
**Out of scope:** Full course builder.

### Implementation Prompt 3

**Objectives:** Build learning product and course engine.  
**Features:** Course builder, curriculum, lessons, resources, quizzes, assignments, review workflow, publishing, versioning.  
**Database work:** Courses, versions, curriculum nodes, lessons, assets, assessments.  
**API work:** Course authoring and review endpoints.  
**UI work:** Instructor course builder and reviewer workspace.  
**Permissions:** Instructor, academy owner, reviewer scopes.  
**Audit:** Course edits, review decisions, publication.  
**Tests:** Course lifecycle and permissions.  
**Acceptance:** Reviewed course can be published.  
**Dependencies:** Prompt 2.  
**Out of scope:** Payments and certificates beyond placeholders.

### Implementation Prompt 4

**Objectives:** Enable learner discovery, purchase, enrollment, progress, and certificates.  
**Features:** Course pages, discovery, checkout, M-Pesa foundation, orders, entitlements, enrollment, progress, learner dashboard, certificates.  
**Database work:** Orders, payments, entitlements, enrollments, progress, certificates.  
**API work:** Checkout, payment verification, enrollment activation.  
**UI work:** Public course pages, checkout, dashboard, learning player.  
**Permissions:** Learner and parent access.  
**Audit:** Payment, entitlement, certificate issuance.  
**Tests:** Payment callback, entitlement, progress.  
**Acceptance:** Learner pays by M-Pesa and receives access.  
**Dependencies:** Prompt 3.  
**Out of scope:** Advanced finance.

### Implementation Prompt 5

**Objectives:** Complete instructor and academy operations.  
**Features:** Instructor dashboard, student management, assignment review, academy analytics, earnings ledger, payout requests, academy storefront.  
**Database work:** Assignment submissions, earnings, payout requests, academy storefront settings.  
**API work:** Instructor operations and payout request endpoints.  
**UI work:** Instructor dashboard, review queues, storefront pages.  
**Permissions:** Academy team and finance scopes.  
**Audit:** Grading, payout request, storefront changes.  
**Tests:** Instructor cannot access unrelated learners.  
**Acceptance:** Instructor can manage learners and request payout.  
**Dependencies:** Prompt 4.  
**Out of scope:** Automated payouts.

### Implementation Prompt 6

**Objectives:** Build enterprise workspaces.  
**Features:** Structures, staff import, assignments, compliance learning, internal academies, reports, subscription foundation.  
**Database work:** Organizations, units, members, imports, assignments, reports.  
**API work:** Import, assignment, reporting endpoints.  
**UI work:** Enterprise workspace, people, departments, assignment dashboard.  
**Permissions:** Organization-scoped roles.  
**Audit:** Imports, assignments, reports.  
**Tests:** Organization isolation.  
**Acceptance:** Employer imports staff and assigns training.  
**Dependencies:** Prompts 2-4.  
**Out of scope:** Advanced SSO.

### Implementation Prompt 7

**Objectives:** Integrate Solco live learning.  
**Features:** Live sessions, calendar, attendance, recording metadata, coaching, events, messaging, notifications.  
**Database work:** Sessions, attendance, registrations, messages, calendar events.  
**API work:** Solco session creation, join tokens, callbacks.  
**UI work:** Session scheduling, waiting room link, calendar, attendance reports.  
**Permissions:** Host, participant, parent, corporate scopes.  
**Audit:** Attendance, recording access, host actions.  
**Tests:** Join eligibility and attendance.  
**Acceptance:** Course-linked Solco session records attendance.  
**Dependencies:** Prompts 3-6.  
**Out of scope:** Advanced whiteboard.

### Implementation Prompt 8

**Objectives:** Build AI foundation.  
**Features:** AI gateway, provider abstraction, course-grounded AI Tutor, AI Course Creator, prompt registry, usage ledger, cost controls, safety and audit.  
**Database work:** AI providers, prompts, conversations, usage, source documents.  
**API work:** Gateway endpoints and retrieval.  
**UI work:** Learner AI Tutor, instructor AI Studio basics, admin AI settings.  
**Permissions:** Context-aware retrieval and feature access.  
**Audit:** AI requests, sources, cost, safety.  
**Tests:** RAG, prompt injection, tenant isolation.  
**Acceptance:** AI answers course questions from authorized sources.  
**Dependencies:** Prompts 3-4.  
**Out of scope:** Advanced AI Mentor.

### Implementation Prompt 9

**Objectives:** Complete finance capabilities.  
**Features:** Coupons, refunds, revenue allocation, reconciliation, scholarships, sponsorships, marketplace financials, affiliate foundation.  
**Database work:** Refunds, reconciliations, scholarships, sponsors, affiliates, adjustments.  
**API work:** Finance workflows and reports.  
**UI work:** Finance admin, refund screens, scholarship admin, sponsor reports.  
**Permissions:** Finance segregation.  
**Audit:** Every financial movement and approval.  
**Tests:** Ledger consistency and reconciliation.  
**Acceptance:** Refund reverses allocations correctly.  
**Dependencies:** Prompt 4 and 5.  
**Out of scope:** Multi-currency.

### Implementation Prompt 10

**Objectives:** Complete platform operations and production readiness.  
**Features:** Super Admin completion, CMS, search, analytics, trust and safety, child safeguarding, support, security hardening, tests, deployment, launch validation.  
**Database work:** CMS, support, reports, moderation, feature flags, system settings.  
**API work:** Admin, CMS, support, search, reports.  
**UI work:** Admin domains, CMS, help centre, support console, dashboards.  
**Permissions:** Full admin and moderation scopes.  
**Audit:** Admin configuration, support access, safety cases.  
**Tests:** End-to-end launch suite.  
**Acceptance:** Launch readiness checklist passes.  
**Dependencies:** Prompts 1-9.  
**Out of scope:** Phase 2 features.

---

## 79. Risks and Mitigations

- **Scope overload:** Keep MVP disciplined and phase advanced features.
- **Tenant leakage:** Use RLS, server checks, test matrix, and audit logs.
- **Financial errors:** Use immutable ledgers, reconciliation, dual approval, and finance tests.
- **AI safety failure:** Use gateway, grounding, high-stakes controls, and incident playbooks.
- **Child safety failure:** Dedicated safeguarding domain, strict defaults, and specialist review.
- **Poor course quality:** Review workflows, quality gates, analytics, and learner feedback.
- **Provider outages:** Fallbacks and graceful degradation for AI, payments, Solco, and notifications.
- **Hardcoded business rules:** Admin configuration and seed data editable after installation.
- **Low adoption:** Launch with focused schools, quality content, instructor support, and employer adoption tools.

---

## 80. Final Acceptance Criteria

The Master Blueprint is complete when:

- Chapters 1-10 align.
- Major roles are defined.
- Major workflows are defined.
- Major data objects are defined.
- Security boundaries are clear.
- Tenant boundaries are clear.
- Financial logic is traceable.
- AI governance is clear.
- Solco boundaries are clear.
- Admin configuration is clear.
- MVP is realistic.
- Future phases are separated.
- Implementation prompts are clearly sequenced.
- Outstanding decisions are listed.
- Risks are documented.
- Acceptance criteria are measurable.

---

## 81. Final Product Recommendation

Build Solva Academy as a standalone platform at `academy.solvaone.co.ke`, deeply connected to the Solva ecosystem but not dependent on SolvaOne’s document-generation application. It should become a place to learn, teach, build academies, train teams, practice real skills, attend live Solco classes, earn verified credentials, and use AI responsibly.

The final product direction is:

- Start focused, but architect for scale.
- Build the admin and tenant foundation properly.
- Make academies real education businesses.
- Make learning practical and outcome-driven.
- Make M-Pesa and affordability central.
- Make Solco live learning native.
- Make AI grounded, useful, and governed.
- Protect children and privacy by design.
- Keep instructors and employers financially and operationally informed.
- Use configuration, audit logs, testing, and governance as core product capabilities.

Solva Academy should be built for affordable access, lasting impact, Kenyan relevance, African expansion, and long-term usefulness beyond any single technology trend.

