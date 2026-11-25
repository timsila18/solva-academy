# Learner launch upgrade

## Scope

This release completes a focused learner journey: purchase history, class playback,
resume, resources, knowledge checks, learning records, completion certificates,
and support conversations. It does not activate a payment merchant or publish the
existing HR course.

## Database release gate

Owner approved the Academy-only database update on 25 November 2026. Migration
0030 was applied and recorded in migration history. The database integration test
completed successfully; a follow-up query confirmed zero remaining rollback
users or courses, protected answer snapshots and issuance RPC, and the unchanged
16-class HR draft. No real completion award was created by the tests.

Apply `0030_learner_checks_and_records.sql` to the Academy project only, after
owner approval. Then run `supabase/tests/learner_launch.sql`. The integration test
creates temporary fixtures inside a rolled-back exception block, not permanent
users, enrollments, or certificates. Repair the Supabase migration history for
0030 after successful application. Do not promote an application deployment that
depends on the new functions before the migration and tests succeed.

The migration restricts browser writes to scored attempts, lesson progress,
resume positions, completion records, and certificates. Only authenticated server
paths write those records. Answer-key snapshots are not selectable by browser
database clients. New grants expose only non-secret attempt metadata.

## Owner workflow

1. Continue adding videos, class outcomes, practice exercises, resources, and
   questions in Course Studio.
2. Open **Completion and certificates** from the course overview.
3. Set a pass mark and attempt allowance. Require checks and opt into completion
   certificates only when satisfied with the complete curriculum.
4. Save these settings again after adding new checks. Existing completed courses
   remain read-only; course version migration is not changed by this release.
5. Submit through the existing course review and publication process. Approved
   publication activates that version's drafted lesson-linked assessments.
6. Verify a real enrollment in staging before opening paid enrollment.

## Learner behavior

- Video resumes from the saved class and position. Speed controls operate locally.
- Native playback emits progress saves every 15 seconds, on pause, and on end.
  Completion indicates recorded activity; it is not proctored identity or proof
  that a learner watched attentively. Progress never replaces assessment results.
- Questions and options are projected from a private attempt snapshot. Keys are
  excluded until a closed attempt, and then only if configured for disclosure.
- Answers are queued and saved to the server. Submission is transactional and
  idempotent; previously submitted answers cannot change the grade.
- Practice retries respect instructor attempt limits. Time-limited checks fail
  answers submitted after the deadline. Randomized delivery and manual grading
  are not implemented here; single-choice automated checks are supported.
- Individual-class access includes the purchased class and attached resources.
  This release's scored-check attempts and course-completion certificate require
  a full-course enrollment. Do not advertise full-course awards for class buys.
- Completion requires all required version-scoped lessons and required supported
  checks. Unknown custom rules and required manual assignments fail closed.
- Certificates require the instructor's explicit enablement, valid current
  access, verified completion records, and an active course-specific template.
  Existing HR specimen templates remain disabled until the owner opts in.
- Receipts are available only for the signed-in customer's paid orders with an
  issued receipt record. They are payment receipts, not represented as tax invoices.
- Certificates, records, and receipts have print / Save PDF controls. QR codes
  are generated locally, without sending learner names to a QR service.

## Manual checklist

- Register and sign in on desktop and a narrow mobile viewport.
- Verify the same learner resumes the correct class and position after reload.
- Change playback speed, pause, seek, and finish a class; confirm saved state.
- Search transcript text and try a missing word. Check long text does not overflow.
- Download a real class resource; deny access with another account or expired grant.
- Open a check; inspect the response to confirm no correctness flags or explanation
  are present before submission. Reload after selecting an answer and check autosave.
- Submit wrong answers, retry, exhaust attempts, and attempt double submission.
- Confirm a different learner cannot open or submit the attempt.
- Complete all required lessons but fail a required check; certificate must remain
  unavailable. Pass checks and verify a single completion award is issued.
- Scan the QR code, verify status, and confirm revoked awards are not shown as valid.
- Try accessing another learner's record, receipt, certificate, and support ticket.
- Use the payment provider's sandbox to test success, cancellation, duplicates,
  delayed callbacks, and mismatched amount/currency before live activation.
- Do not test a real charge or issue a real credential to an unqualified learner.

## Explicitly deferred / external prerequisites

- Merchant onboarding and live Paystack keys; no real card or M-Pesa payment was
  made or live payment activation claimed.
- Adaptive streaming / low-bitrate renditions, audio-only delivery, VTT caption
  ingestion, automatic transcripts, and DRM. A 350 MB upload ceiling is not ABR.
- Instructor Q&A communities, live clinics, manually graded practical assignments,
  reviewed employment-law templates, referrals, employer bundles, and cohort analytics.
- Verification of accreditation, professional-body recognition, and refund terms
  requires owner and jurisdiction-specific review. The app makes no such claims.
- Browser verification depends on an available browser automation session. Do not
  substitute a successful build or unit test for a production learner purchase.
