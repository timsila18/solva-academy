# Production Implementation Prompt 4

Prompt 4 adds the learner commerce and learning-access foundation for Solva Academy. It deliberately avoids advanced subscriptions, payouts, revenue sharing, enterprise learning, Solco live sessions, scholarships, and AI Tutor work.

## Implemented Scope

- Public course discovery placeholders with filters and no fake course statistics.
- Checkout order creation, free enrollment, M-Pesa STK initiation, M-Pesa callback processing, payment attempts, and payment callbacks.
- Products, product prices, course-product linkage, coupons, orders, receipts, entitlements, enrollments, saved courses, lesson progress, learner course positions, quiz attempts, assignment submissions, assignment grades, completion records, certificate templates, certificates, certificate files, and refund requests.
- Learner pages for saved courses, orders, refunds, course player, enrollment activity, and quiz attempt foundation.
- Admin finance and enrollment pages.
- Public certificate verification through a security-definer RPC that returns only safe certificate fields.
- RLS policies for learner-owned records, finance/admin access, entitlement and enrollment access, certificate access, and refund access.

## M-Pesa Notes

The M-Pesa integration supports live Daraja credentials through environment variables and falls back to a simulated STK response when credentials are absent. Production use still requires confirmed Daraja credentials, a public callback URL, callback IP/security review, and end-to-end reconciliation testing.

## Routes Added

- `/checkout/[orderId]`
- `/checkout/[orderId]/status`
- `/learn/[courseId]`
- `/learn/enrollment/[enrollmentId]`
- `/learn/quiz/[attemptId]`
- `/learner/saved`
- `/learner/orders`
- `/learner/refunds`
- `/certificates/verify`
- `/certificates/verify/[code]`
- `/admin/finance`
- `/admin/enrollments`
- `/api/payments/mpesa/callback`

## Validation

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `supabase db push --db-url $DATABASE_URL`

## Deferred to Later Prompts

- Full course marketplace merchandising and product administration UI.
- Full assignment grading UI.
- Certificate PDF generation and storage.
- Refund approval execution and money movement.
- Payouts, revenue share, subscriptions, scholarships, bundles, and enterprise enrollment engine.
