# Course Studio

## Owner workflow

1. Open Teaching > My courses, or Academy > Courses.
2. Choose Create course, select an authorized workspace and course format, and enter details and KES prices.
3. Paste class titles, one per line. The list is optional at creation; add classes later.
4. Open a class to edit its title, notes, outcomes, activity, duration and individual price.
5. Upload an MP4 and optional PDF/PPTX/image materials. Add four-option knowledge checks and answer explanations.
6. Reorder classes, duplicate an outline, or remove and restore classes.
7. Submit a complete draft for review. Submission is not publication or checkout activation.

The HR masterclass retains its existing sixteen lessons and prices. Templates select structure/course format only; they do not copy the HR syllabus into another academy. Duplicate copies outline text, not media, questions, resources or learner records.

## Security and persistence

- Migrations 0024-0026 add configurable templates/settings, scoped authorization, transactional Studio commands and guarded upload attachment.
- Creation requires an active eligible workspace membership and ownership or scoped course-creation permission. Studio currently edits courses owned by the current account; delegated co-author editing is not included.
- The owning workspace and course owner are checked server-side and in security-definer commands. Client-supplied identifiers never grant access.
- Commands lock the course row. Draft mutations, prices and audit events commit together.
- Published history, enrollments, order items and class entitlements prevent editing. Removed classes are archived, not deleted.
- Existing restrictive delivery RLS uses the new edit predicate. Upload attachment checks the active draft, storage object, MIME type, size and path under a course lock.
- Instructor answer keys are owner-only and are not included in public course responses.
- Publication requires governed platform permissions. The legacy submission RPC now delegates to Studio readiness checks.

## Verification

Automated tests cover validation, wizard navigation, action failures, authorization and resource-upload boundaries. `supabase/tests/course_studio.sql` creates rollback-only fixtures in a transaction to exercise real commands, pricing, ordering, duplication, archive/restore, questions, submission, access rejection and historical-version freezes. It does not retain test courses.

Manual checklist:

- Sign in as an academy owner; confirm only eligible named workspaces appear.
- Create a private draft and reopen it from the course list.
- Edit, add, reorder, duplicate, remove and restore classes; refresh after each operation.
- Verify all sixteen HR lessons and saved KES prices remain present.
- Upload a real compressed MP4, then preview it through the existing learner preview once available.
- Add a PDF/PPTX/image resource and reopen its signed link.
- Create/edit/remove a four-option question and verify exactly one correct answer.
- Attempt to submit without videos/outcomes, then complete the draft and submit.
- Check keyboard focus, narrow-screen wrapping, touch controls and screen-reader labels in a browser.
- Confirm another account cannot open or mutate the course through direct URLs or API requests.

## Known boundaries

- Compressed MP4 uploads are capped at 350,000,000 bytes; resources remain capped at 50 MiB.
- Course Studio can open the locally installed compressor for large originals. Compression reads the original directly, uses two-pass H.264 encoding within a duration-based budget, and rejects output over the ceiling. Only compressed output is uploaded. It is not a cloud compressor for devices without the helper.
- Academy video storage uses the separately configured HostAfrica/DirectAdmin endpoint. Supabase remains responsible for identities, course records, authorizations and upload receipts. Existing Supabase-hosted videos remain supported.
- No real teaching video was available for production playback testing. Browser automation was disabled, so interactive visual verification remains manual.
- New-version branching for published/purchased courses and delegated co-author workflows are deferred; those courses are intentionally read-only.
- Existing platform course-review administration needs further completion; a submission creates its review record but Studio does not auto-approve or publish it.
- Payment-provider activation, learner quiz execution/scoring and automatic certificate issuance are not implemented by this change.
- Existing framework security advisories require a separately tested framework upgrade; this change does not resolve them.
