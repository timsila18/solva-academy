# Academy Application Review

Platform administration > Applications (`/admin/review-queues`) now reads saved
academy applications instead of displaying an empty placeholder or requesting UUIDs.
The default view shows submitted, under-review, and changes-requested applications.
The All applications filter includes previous decisions. Each view shows the newest
100 records; pagination and other application types are not part of this change.

## Access and Decisions

The page requires platform administration access. The review RPC separately checks
`application.review.platform`, derives the reviewer from the authenticated session,
and locks the application before applying a decision. Requests for changes and
rejections require notes. Approval creates the private draft academy, branding,
workspace, membership, and academy-scoped owner role atomically, then records an
audit event and notification. Duplicate decisions and slug collisions are rejected.

Migrations 0021 and 0022 restrict the former provisioning function and correct its
ambiguous academy_id variable. The internal function is not client-callable.

## Verification

- Unit tests cover listing, query errors, authorization, validation, success and failure.
- `supabase/tests/academy_review.sql` tests provisioning, role scope, audit,
  queue status, reviewer spoofing, anonymous access and duplicate approval. All test
  writes are rolled back inside a subtransaction, including notifications.
- Manual: sign in as an administrator, open Applications, expand a submission,
  select a decision, save, and check All applications. For approval, refresh the
  owner's workspace switcher and verify the new academy appears.

Solva HR Academy's real application was located in submitted status. It was not
approved or modified as part of this repair; the administrator makes that decision.
