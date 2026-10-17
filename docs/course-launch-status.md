# Course delivery launch status

## Implemented in this change

- Signup redirects directly to the learner area when Supabase returns a session.
- Supabase Academy email confirmation disabled on 17 October 2026 and verified through the settings API.
- Public course listings, course details, live prices, and checkout use database records.
- Course owners select modules and upload private MP4 lesson files directly to Supabase Storage (100 MB per file).
- Enrolled learners receive expiring video URLs, curriculum navigation, resume position, and completion recording.
- Missing M-Pesa configuration fails closed instead of simulating success.
- Optional Paystack hosted card/mobile-money checkout and signed, server-verified webhooks.
- Separate individual-class checkout and access, class pricing controls, and full-course pricing controls.
- Migration 0012 restricts curriculum mutations, private lesson content, and client-side financial writes; completion RPC is service-only.

## Required before a paid launch

1. Add the actual 16 video titles, final files, course information, and agreed price.
2. Configure an approved merchant account. For hosted cards and M-Pesa: set `PAYSTACK_SECRET_KEY` in local and Vercel production settings; production requires a live key. Enable the applicable payment channels in the merchant dashboard.
3. Register `https://academy.solvaone.co.ke/api/payments/paystack/webhook` in the merchant dashboard.
4. If using direct Daraja instead: configure `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_ENV`, and a random `MPESA_CALLBACK_TOKEN`.
5. Test successful, cancelled, failed, duplicate, and delayed payment notifications in sandbox, then perform a user-authorized live payment.
6. Pilot actual videos on a mobile connection. The current uploader has no transcoding, adaptive streaming, resumable upload, or DRM. Videos above 100 MB need a dedicated video delivery integration or smaller delivery copies.
7. Validate approved publication/version mapping and enrollment in an instructor-to-learner browser session. Existing platform features outside this change still contain foundations and placeholders.

## Operational notes

Keep all merchant secrets server-side; never add secrets to `NEXT_PUBLIC_*` variables. Do not grant platform administrator privileges based solely on an email address at signup. Immediate signup does not prove ownership of the submitted email.

Migration 0012 was applied directly to the Academy database through its configured connection.

Migrations 0012-0015 were applied to the Academy database. Signup/password login were tested using disposable smoke profiles (disabled after testing). The settlement SQL test rolls back its fixtures and checks class-only access, full-course enrollment, duplicate notifications, and restricted settlement execution. Provider settlement in this test is simulated at the database boundary; no real money was charged.

## Proposed HR Practice A to Z prices (not activated)

- One episode: KES 1,000 (owner proposal).
- Full 16-episode course: KES 16,000 (owner proposal).
- All episodes bought separately: KES 16,000.
- No bundle discount has been agreed.

These are the owner's proposed prices, not activated listings. Final prices should account for episode length, downloadable materials, tutor support, transaction costs, and the target learners' budgets. Consider crediting previous episode purchases toward a full-course upgrade.

Migration 0014 adds separate episode products, episode entitlements, and episode progress. Individual-class orders grant only the purchased lesson/version; full-course orders use the existing enrollment model. Pricing controls exist for each class and for the whole course. Upgrade credits are not implemented. Actual files, publication, and payment-provider tests remain required before prices can be enabled for sale.

Paystack setup: create the business account manually, complete merchant activation, enable the supported Kenyan payment channels, configure test keys and the webhook, complete sandbox tests, and then configure a live key. No merchant account was created by this change.
