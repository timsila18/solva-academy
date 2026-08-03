# Solva Academy Master Product Blueprint

## Chapter 9: Payments, Subscriptions, Memberships, Wallets, Revenue Sharing, Payouts, Scholarships, Sponsorships, Affiliates, Refunds, Tax, Billing, and Financial Controls

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Product and system blueprint only. No production code.

---

## 1. Executive Summary

Solva Academy’s financial system must be much more than a basic “pay for course” checkout. It must support affordable learner payments, M-Pesa, course purchases, memberships, enterprise subscriptions, instructor and academy earnings, revenue sharing, marketplace sales, coaching payments, event ticketing, sponsorships, scholarships, affiliate commissions, refunds, payouts, invoices, reports, audit trails, fraud controls, and future cross-Solva payment integration.

Chapters 1 through 8 established Solva Academy as a standalone learning ecosystem with academies, learners, instructors, enterprise workspaces, Solco live learning, AI, certificates, practice labs, and marketplace products. Chapter 9 defines the commercial and financial operating layer that allows the ecosystem to function transparently and sustainably.

The financial architecture must be:

- Transparent.
- Explainable.
- Auditable.
- M-Pesa-first for Kenya.
- Provider-independent.
- Modular.
- Affordable for Kenyan learners.
- Suitable for future African expansion.
- Strongly permissioned by tenant and role.
- Built around immutable ledgers and reconciliation.

---

## 2. Financial Philosophy

The financial system should follow these principles:

1. Payments must be simple for learners.
2. Earnings must be transparent for instructors and academies.
3. Employers must understand exactly what they are paying for.
4. Scholarships and sponsorships must be traceable.
5. Revenue splits must be agreed before a sale.
6. Refund effects must be clear.
7. Financial actions must be auditable.
8. M-Pesa must be treated as a primary payment channel in Kenya.
9. The system must not depend on a single payment provider.
10. Finance must support both marketplace and enterprise use.
11. Fees should not make low-cost courses commercially impossible.
12. Financial data must remain strictly isolated by tenant and role.

The platform should never hide why money moved, who earned what, who funded a discount, why funds are held, or how refunds affect balances.

---

## 3. Commercial Product Types

The financial system should support different commercial treatment for:

- Free course.
- Paid course.
- Course bundle.
- Learning path.
- Membership.
- Subscription.
- Paid live class.
- Webinar.
- Event ticket.
- Coaching session.
- Group coaching.
- Bootcamp.
- Corporate training.
- Internal enterprise subscription.
- Marketplace product.
- Template pack.
- Practice lab.
- Certificate fee where appropriate.
- Academy membership.
- Sponsored enrollment.
- Scholarship enrollment.
- Custom training contract.
- Donation-supported program.
- Future Solva ecosystem bundle.

Each product type may have different pricing, access, refund, revenue share, tax, billing, settlement, expiry, and commission rules.

---

## 4. Currency Architecture

Kenyan Shilling should be the default currency for launch, with future multi-currency support.

The system should support:

- Kenyan Shilling as default.
- Future multi-currency support.
- Currency-specific pricing.
- Currency conversion display.
- Settlement currency.
- Payout currency.
- Exchange-rate source.
- Conversion fee.
- Currency rounding.
- Currency-specific minimums.

Ledger values must not be mixed across currencies without explicit conversion records. Every conversion should record source amount, source currency, exchange rate, fee, target amount, target currency, timestamp, and provider.

---

## 5. Payment Provider Abstraction

The platform must not be tightly coupled to one provider.

### Supported Payment Methods

The payment abstraction layer should support:

- M-Pesa STK Push.
- M-Pesa Paybill.
- M-Pesa Till.
- Bank transfer.
- Card payment.
- Future Airtel Money.
- Future regional mobile money.
- Future wallet balance.
- Enterprise invoice payment.
- Purchase order.
- Sponsor-funded payment.
- Scholarship credit.
- Promotional credit.

### Provider Capabilities

The layer should support:

- Provider routing.
- Webhook verification.
- Retry.
- Timeout.
- Duplicate callback handling.
- Reconciliation.
- Provider outage handling.
- Payment status polling.
- Idempotency.
- Failed payment recovery.
- Refund support.
- Settlement reporting.

Payment providers should be replaceable without rewriting the application’s commercial logic.

---

## 6. M-Pesa Architecture

M-Pesa should be a first-class payment channel.

### Required M-Pesa Capabilities

Support:

- STK Push.
- Paybill instructions.
- Account reference.
- Till number future support.
- Transaction confirmation.
- Failed prompt.
- Cancelled prompt.
- Timeout.
- Wrong reference handling.
- Duplicate payment.
- Underpayment.
- Overpayment.
- Reconciliation.
- Refund.
- Manual verification.
- Callback verification.

### Payment Reference Design

Payment references should identify:

- User.
- Order.
- Course.
- Academy.
- Organization.
- Invoice.
- Sponsorship program.
- Marketplace product.

Avoid exposing sensitive internal identifiers directly where possible. Use short external references mapped to internal records.

---

## 7. Checkout

Checkout should be clear, mobile-first, and predictable.

Checkout should show:

- Product summary.
- Academy.
- Instructor.
- Price.
- Discount.
- Tax.
- Fees.
- Total payable.
- Access duration.
- Refund terms.
- Certificate inclusion.
- Coupon.
- Scholarship application.
- Sponsorship credit.
- Payment method.
- Invoice details where applicable.
- Parent checkout for child.
- Organization checkout.
- Gift purchase future support.

The user should never be surprised by the final payable amount. Checkout should preserve pending orders when mobile money prompts time out.

---

## 8. Orders and Payment Status

Orders and payments should be separate objects.

### Order Contents

An order may contain:

- One course.
- Several courses.
- Bundle.
- Marketplace product.
- Coaching.
- Event ticket.
- Membership.
- Subscription.
- Practice lab.
- Certificate add-on.
- Corporate seats.

### Order Statuses

Statuses:

- Draft.
- Pending Payment.
- Payment Initiated.
- Paid.
- Partially Paid.
- Failed.
- Cancelled.
- Refunded.
- Partially Refunded.
- Disputed.
- Under Review.
- Expired.
- Voided.

### Payment Statuses

Payment statuses:

- Created.
- Pending.
- Processing.
- Successful.
- Failed.
- Cancelled.
- Timed Out.
- Reversed.
- Refunded.
- Partially Refunded.
- Duplicate.
- Under Review.
- Reconciled.
- Unmatched.

All order and payment changes must be auditable.

---

## 9. Enrollment and Entitlements

Enrollment must be activated server-side after verified payment.

### Post-Payment Flow

After successful payment:

1. Payment is verified.
2. Order is marked paid.
3. Access entitlement is created.
4. Enrollment is activated.
5. Revenue allocation is recorded.
6. Receipt is issued.
7. Instructor and academy earnings are marked pending.
8. Learner receives confirmation.
9. Relevant notifications are sent.
10. Audit records are created.

Enrollment must not rely only on the frontend receiving a successful response.

### Entitlement Types

Entitlements may grant:

- Course access.
- Bundle access.
- Membership access.
- Learning path access.
- Event access.
- Coaching booking.
- Marketplace download.
- Practice lab access.
- Corporate seat.
- Certificate access.

Entitlements should track user, product, source order, start date, end date, access scope, status, revocation reason, transferability, organization linkage, and parent-child linkage.

---

## 10. Pricing Models

Pricing models should be administrator-configurable.

Support:

- Fixed price.
- Free.
- Pay what you can.
- Suggested contribution.
- Subscription.
- Membership.
- Per seat.
- Per active learner.
- Per module.
- Per live session.
- Per cohort.
- Per event.
- Per coaching session.
- Tiered pricing.
- Volume pricing.
- Regional pricing.
- Early-bird pricing.
- Promotional pricing.
- Corporate negotiated pricing.
- Scholarship-supported pricing.
- Sponsor-covered pricing.

Pricing should account for payment fees, storage, media delivery, AI usage where included, instructor shares, and affordability.

---

## 11. Affordability Controls

To support Kenyan affordability, define:

- Micro-course pricing.
- Installment eligibility future support.
- Group pricing.
- Student pricing.
- Youth pricing.
- Sponsored seats.
- Free previews.
- Learning bundles.
- Low-cost memberships.
- Corporate volume discounts.
- Academy promotions.
- Platform-funded discounts.
- Community access programs.

The platform should not force all courses into the same minimum price. At the same time, it should warn when pricing cannot reasonably cover provider, payment, storage, or delivery costs.

---

## 12. Discounts and Coupons

The discount engine should support:

- Percentage discount.
- Fixed discount.
- Free access.
- First-course discount.
- Returning learner discount.
- Bundle discount.
- Group discount.
- Corporate discount.
- Student discount.
- Early-bird.
- Seasonal offer.
- Scholarship code.
- Sponsor code.
- Affiliate code.
- Academy code.
- Platform code.

Rules should include start and end date, usage limit, per-user limit, eligible products, eligible academies, eligible learners, minimum order, maximum discount, stackable or non-stackable, channel-specific rules, and campaign-specific rules.

Coupon governance should track creator, approver, funding source, financial effect, attribution, usage, remaining redemptions, fraud alerts, cancellation, expiry, and audit trail.

The ledger must distinguish platform-funded, academy-funded, instructor-funded, and sponsor-funded discounts.

---

## 13. Memberships

Memberships should create ongoing value and predictable access.

Support memberships such as:

- Platform learner membership.
- Academy membership.
- School membership.
- Corporate membership.
- Premium AI membership.
- Family membership future support.
- Professional membership.
- Child learning membership.

Membership benefits may include course access, course discounts, AI allowance, live sessions, community access, marketplace discounts, coaching discounts, certificate discounts, priority support, and practice labs.

Membership rules should define eligibility, benefits, renewal, cancellation, grace period, and included usage.

---

## 14. Subscriptions

Subscriptions should support individual, academy, and enterprise use cases.

### Subscription Terms

Support:

- Monthly.
- Quarterly.
- Semiannual.
- Annual.
- Custom enterprise term.
- Trial.
- Grace period.
- Auto-renew.
- Manual renew.
- Pause future support.
- Upgrade.
- Downgrade.
- Cancellation.
- Non-renewal.

### Subscription Statuses

Statuses:

- Trial.
- Active.
- Past Due.
- Grace Period.
- Suspended.
- Cancelled.
- Expired.
- Pending Renewal.
- Pending Payment.
- Closed.

Subscription billing must support billing date, proration, upgrade credit, downgrade timing, renewal reminders, failed payment retry, grace period, access restriction, cancellation date, reactivation, invoice generation, and tax handling.

Do not silently charge without proper consent.

---

## 15. Enterprise Billing

Enterprise billing should support flexible institutional arrangements.

Support:

- Seat-based subscription.
- Active-user billing.
- Usage-based billing.
- Department package.
- Annual contract.
- Custom quotation.
- Purchase order.
- Invoice.
- Credit terms.
- Bank transfer.
- M-Pesa.
- Card.
- Multi-branch billing.
- Cost centre allocation.
- Sponsored contract.
- Government procurement process.
- Contract renewal.
- Additional seat charges.
- Overage.

Enterprise billing roles should be separable from learning administration roles.

---

## 16. Invoices and Receipts

### Invoices

Invoices should include:

- Organization.
- Billing contact.
- Invoice number.
- Billing period.
- Plan.
- Seats or usage.
- Discounts.
- Taxes.
- Credits.
- Amount due.
- Due date.
- Payment instructions.
- Purchase order number.
- Status.
- Payment history.

Invoice statuses:

- Draft.
- Issued.
- Partially Paid.
- Paid.
- Overdue.
- Disputed.
- Cancelled.
- Written Off.
- Credited.

### Receipts

Receipts should be issued for successful payments and include receipt number, customer, product, academy, amount, tax, discount, payment method, payment reference, date, order number, and status.

Receipts should be downloadable and printable.

---

## 17. Revenue Allocation

Every successful sale should generate traceable allocations.

Possible beneficiaries:

- Platform.
- Instructor.
- Co-instructor.
- Academy.
- Affiliate.
- Sponsor recovery fund.
- Tax authority where applicable.
- Payment provider.
- Refund reserve.
- Scholarship fund contribution.
- Content licensor.

Each allocation should trace to order, product, payment, revenue rule, beneficiary, amount, currency, and status.

---

## 18. Revenue Sharing

Revenue share rules should be versioned and never retroactively edited.

Rules may be:

- Global.
- School-specific.
- Academy-specific.
- Instructor-specific.
- Course-specific.
- Product-specific.
- Enterprise contract-specific.
- Promotion-specific.
- Affiliate-specific.

Rules should define gross basis, net basis, fee treatment, discount treatment, tax treatment, refund treatment, reserve, settlement delay, expiry, approval, and version.

Never modify historical allocations by editing a rule retroactively. Post formal adjustment entries instead.

---

## 19. Multi-Instructor Splits

Support splits among:

- Lead instructor.
- Co-instructor.
- Guest instructor.
- Academy.
- Content owner.
- Assessor.
- Translator.
- Affiliate.
- Platform.

All parties should accept the split before publication or sale where relevant. Changes should affect future sales only unless a formal adjustment is posted.

---

## 20. Earnings Ledger

The earnings ledger should record:

- Gross sale.
- Discount.
- Tax.
- Provider fee.
- Platform fee.
- Academy share.
- Instructor share.
- Affiliate commission.
- Reserve.
- Refund adjustment.
- Reversal.
- Net earnings.
- Available date.
- Payout status.

Statuses:

- Pending.
- Held.
- Available.
- Paid.
- Reversed.
- Refunded.
- Disputed.
- Frozen.
- Adjusted.

The ledger should be append-only in principle. Historical financial records should be corrected through adjustment entries, not silent edits.

---

## 21. Wallets and Credits

Internal wallets should support platform credit and earnings tracking without being treated as unrestricted banking products.

### Wallet Types

Support wallets for:

- Learner credit.
- Instructor earnings.
- Academy earnings.
- Affiliate earnings.
- Scholarship credits.
- Sponsor funds.
- Enterprise prepaid credit.
- Platform promotional credit.

### Wallet Transactions

Transaction types:

- Credit.
- Debit.
- Purchase.
- Refund.
- Payout.
- Adjustment.
- Promotional credit.
- Scholarship credit.
- Sponsor credit.
- Expiry.
- Reversal.
- Transfer where permitted.
- Chargeback.
- Reserve hold.
- Reserve release.

Each transaction should include source, destination, amount, currency, reference, balance before, balance after, date, status, reason, actor, and audit metadata.

Learner credits may come from refund, gift credit future support, scholarship, sponsorship, promotion, enterprise benefit, or manual admin adjustment.

---

## 22. Payouts

Payouts should support instructors, academies, affiliates, and other earning beneficiaries.

### Payout Methods

Support:

- M-Pesa.
- Bank transfer.
- Future regional mobile money.
- Future payout provider.

### Payout Setup

Collect:

- Legal or display name.
- Payment name.
- Phone.
- Bank details.
- Verification status.
- Tax information where required.
- Preferred method.
- Minimum threshold.
- Payout schedule.

### Workflow

1. Earnings become available.
2. Beneficiary requests payout or scheduled payout begins.
3. System checks minimum threshold.
4. Identity and payout profile are verified.
5. Fraud and dispute checks run.
6. Payout enters approval.
7. Payout is sent.
8. Provider confirmation is received.
9. Ledger is updated.
10. Statement is issued.
11. Failure or reversal is handled.

Payout statuses include Draft, Requested, Pending Review, Approved, Processing, Paid, Failed, Reversed, Held, Cancelled, and Under Investigation.

---

## 23. Payout Controls

Protect payouts using:

- Re-authentication.
- MFA.
- Cooling period after payout detail changes.
- Dual approval for large payouts.
- Threshold alerts.
- Duplicate payout detection.
- Beneficiary name checks.
- Fraud review.
- Dispute hold.
- Chargeback reserve.
- Audit logging.

Founding Super Admin should not bypass all controls without a logged emergency process.

---

## 24. Reserves and Settlement

Reserve rules should be transparent.

Define:

- Settlement delay.
- Refund reserve.
- Chargeback reserve.
- Risk-based reserve.
- New instructor reserve.
- High-risk product reserve.
- Release date.
- Reserve statement.

Reserve logic should explain why funds are held, when they become available, and what events may extend or release the hold.

---

## 25. Refunds

Refund policy architecture should vary by product type.

Policies may vary by:

- Course.
- Academy.
- Product type.
- Coaching.
- Event.
- Membership.
- Subscription.
- Corporate contract.
- Marketplace download.
- Certificate fee.

Policy fields include eligibility window, completion threshold, download restriction, live attendance, coaching cancellation, event cancellation, non-refundable components, partial refund rules, credit alternative, and review authority.

### Refund Workflow

1. Learner requests refund.
2. System checks policy.
3. Request is categorized.
4. Academy or instructor may respond.
5. Platform or authorized reviewer decides.
6. Refund or credit is issued.
7. Entitlement is adjusted.
8. Revenue allocations are reversed.
9. Payout impact is recorded.
10. User is notified.
11. Audit record is saved.

Statuses include Requested, Auto-Eligible, Under Review, More Information Needed, Approved, Partially Approved, Rejected, Refunded, Credited, Closed, and Appealed.

---

## 26. Disputes and Chargebacks

Support:

- Payment dispute.
- Duplicate payment.
- Unauthorized payment.
- Product not received.
- Misleading description.
- Service cancellation.
- Technical failure.
- Chargeback.
- Sponsor dispute.
- Enterprise invoice dispute.

Track evidence, communication, decision, financial impact, entitlement status, reserve impact, and appeal.

---

## 27. Scholarships

Scholarships should be traceable, fair, and privacy-aware.

### Funding Sources

Scholarships may be funded by:

- Solva.
- Academy.
- Instructor.
- Company.
- NGO.
- Church.
- Government.
- Individual donor.
- Professional association.
- Community group.

### Scholarship Types

Types:

- Full.
- Partial.
- Course-specific.
- Learning path.
- Cohort.
- Child learner.
- Youth.
- Professional development.
- Disability support.
- County-specific.
- Industry-specific.
- Employer-supported.

Avoid discriminatory or exploitative criteria.

### Workflow

1. Scholarship program is created.
2. Eligibility is defined.
3. Budget or seats are allocated.
4. Applications open.
5. Learner applies.
6. Evidence is reviewed.
7. Award is approved.
8. Credit or entitlement is issued.
9. Progress is tracked.
10. Completion or withdrawal is recorded.
11. Sponsor receives aggregate impact report.

---

## 28. Sponsorships

Sponsors may fund individual learners, cohorts, schools, organizations, counties, churches, youth groups, professional programs, or CSR initiatives.

Sponsors should define:

- Budget.
- Seats.
- Courses.
- Cohort.
- Eligibility.
- Geography.
- Reporting.
- Branding.
- Access period.
- Success indicators.

Sponsorships should create either entitlements, scholarship credits, sponsor fund allocations, or enterprise contracts depending on structure.

---

## 29. Sponsor Fund Accounting

Sponsor reporting must distinguish committed funds from received funds.

Track:

- Sponsor.
- Program.
- Committed amount.
- Received amount.
- Allocated amount.
- Spent amount.
- Remaining amount.
- Refunded amount.
- Expiry.
- Beneficiaries.
- Financial adjustments.

Sponsor dashboards may show funds, seats, enrollments, active learners, completion, certificates, learning hours, course utilization, aggregate outcomes, county or cohort breakdown, and remaining budget.

Protect individual privacy.

---

## 30. Affiliate Program

Approved participants may earn commissions.

Eligible affiliates:

- Learners.
- Tutors.
- Academies.
- Influencers.
- Professional associations.
- Corporate partners.
- Community organizations.

Affiliate settings include approval, commission rate, eligible products, attribution window, cookie or referral tracking, coupon tracking, minimum payout, refund adjustment, fraud controls, and payout method.

Affiliate attribution should track link click, landing page, registration, enrollment, purchase, refund, repeat purchase, device, campaign, coupon, attribution window, and configured model.

Avoid hidden or misleading affiliate attribution.

---

## 31. Marketplace Financials

Marketplace products require clear digital commerce rules.

Support:

- Product price.
- Tax.
- Platform fee.
- Academy share.
- Instructor or creator share.
- Affiliate commission.
- Secure delivery.
- Download limit.
- Refund policy.
- License.
- Sales report.

Digital downloads may have stricter refund rules after access.

---

## 32. Coaching and Event Financials

### Coaching

Coaching payment rules should support:

- Advance payment.
- Deposit.
- Full payment.
- Package.
- Cancellation window.
- Rescheduling.
- Tutor no-show.
- Learner no-show.
- Partial refund.
- Platform fee.
- Tutor earnings release after session.
- Dispute.

### Events

Events should support:

- Free event.
- Paid ticket.
- Early-bird.
- Group ticket.
- Student ticket.
- Sponsor ticket.
- Academy member ticket.
- Refund.
- Transfer.
- Cancellation.
- Reschedule.
- Recording-only access.
- Multi-session pass.

---

## 33. Tax Architecture

Tax handling should be configurable and professionally reviewed. Do not hardcode unsupported legal conclusions.

Support:

- Tax configuration by country.
- Tax category.
- Inclusive or exclusive pricing.
- Withholding treatment where required.
- VAT treatment where required.
- Tax invoice fields.
- Tax identification.
- Exemption.
- Tax reporting.
- Tax adjustment.
- Effective dates.
- Historical rule preservation.

Tax rules must be maintained by authorized finance administrators and reviewed professionally.

---

## 34. Withholding

Where legally applicable, support:

- Withholding tax.
- Platform deduction.
- Instructor deduction.
- Academy deduction.
- Certificate of deduction.
- Tax statement.
- Threshold.
- Exemption.
- Residency treatment.
- Effective date.

Do not assume one rule applies to every instructor or country.

---

## 35. Reconciliation

Reconciliation is mandatory for trust and financial integrity.

Support:

- Daily reconciliation.
- Weekly reconciliation.
- Monthly close.
- Provider settlement reconciliation.
- M-Pesa reconciliation.
- Bank reconciliation.
- Unmatched payment queue.
- Duplicate queue.
- Refund reconciliation.
- Payout reconciliation.
- Revenue allocation reconciliation.
- Sponsor fund reconciliation.

Reconciliation runs should produce exceptions, matched items, unresolved items, adjustments, and audit records.

---

## 36. Unmatched Payments

Unmatched payment workflow:

1. Payment received.
2. Reference cannot be matched.
3. Payment enters unmatched queue.
4. Finance reviews payer details.
5. User submits claim where needed.
6. Payment is matched, refunded, or held.
7. Audit record is created.

Users should have a clear path to claim payments made with wrong references.

---

## 37. Financial Reports

### Platform Reports

Support:

- Gross sales.
- Net revenue.
- Revenue by academy.
- Revenue by instructor.
- Revenue by product.
- Provider fees.
- Refunds.
- Payouts.
- Outstanding balances.
- Scholarship fund.
- Sponsor funds.
- Affiliate commissions.
- Tax.
- Unmatched payments.

### Academy Reports

Support sales, earnings, tutor shares, refunds, payouts, marketplace sales, course sales, coaching, and events.

### Instructor Reports

Support earnings, pending, available, paid, adjustments, tax, refund effects, and affiliate income.

### Enterprise Reports

Support invoices, payments, usage, subscription, seat cost, department allocation, and credits.

---

## 38. Statements

Provide:

- Instructor statement.
- Academy statement.
- Affiliate statement.
- Sponsor statement.
- Enterprise statement.
- Learner wallet statement.
- Scholarship statement.

Statements should show opening balance, movement, closing balance, period, currency, and downloadable records.

---

## 39. Financial Permissions

Separate permissions for:

- View sales.
- View earnings.
- View payouts.
- Request payout.
- Approve payout.
- Configure revenue share.
- Issue refund.
- Approve refund.
- View tax.
- Manage invoices.
- Reconcile payments.
- Adjust ledger.
- View sponsor funds.
- Manage scholarship funds.
- Export reports.

Avoid giving academy content managers unnecessary finance access.

---

## 40. Segregation of Duties

Sensitive actions may require dual approval:

- Large refund.
- Large payout.
- Manual ledger adjustment.
- Tax rule change.
- Revenue share change.
- Sponsor fund transfer.
- Scholarship fund adjustment.
- Enterprise credit.
- Write-off.
- Payout detail override.

Thresholds should be configurable. The person creating an adjustment should not always be able to approve it.

---

## 41. Manual Adjustments

Manual adjustments must require:

- Amount.
- Currency.
- Ledger.
- Reason.
- Supporting evidence.
- Creator.
- Approver.
- Date.
- Related order or account.
- Audit record.

Never silently edit historical financial records. Use adjustment entries.

---

## 42. Fraud and Risk Management

Detect:

- Stolen payment method.
- M-Pesa mismatch.
- Account takeover.
- Payout fraud.
- Refund abuse.
- Coupon abuse.
- Affiliate fraud.
- Scholarship fraud.
- Sponsor fund misuse.
- Fake enrollment.
- Duplicate account.
- Rapid purchase and refund.
- Unusual payout destination.
- Cross-tenant finance access.

Use risk scores carefully and require human review for serious action.

---

## 43. Notifications

Notify users about:

- Payment successful.
- Payment failed.
- Payment pending.
- Order confirmed.
- Receipt ready.
- Subscription renewal.
- Subscription failure.
- Invoice due.
- Refund update.
- Payout update.
- Wallet credit.
- Scholarship award.
- Sponsor allocation.
- Affiliate commission.
- Dispute update.
- Payment reversal.
- Unmatched payment claim.

Notifications should respect role, tenant, privacy, and critical financial notice rules.

---

## 44. Data Privacy

Protect:

- Bank details.
- M-Pesa phone numbers.
- Tax IDs.
- Billing addresses.
- Card tokens.
- Payout records.
- Sponsor information.
- Scholarship evidence.
- Enterprise contracts.

Use encryption, masking, limited access, and audit logs. Never store raw card data unless using a compliant provider and architecture.

---

## 45. Failure and Outage Handling

### Payment Failure

When payment fails:

- Preserve order.
- Explain status.
- Allow retry.
- Offer alternate method.
- Avoid duplicate charges.
- Do not create active entitlement.
- Keep coupon state correctly.
- Record provider response.
- Support support-ticket escalation.

### Provider Outage

If M-Pesa or card provider is unavailable:

- Inform user clearly.
- Save order.
- Allow retry.
- Offer alternative method.
- Avoid false success.
- Queue reconciliation.
- Monitor callbacks.
- Alert finance/admin.

---

## 46. Finance Admin Console

Super Admin and authorized finance users should manage:

- Payment providers.
- Currency.
- Pricing rules.
- Platform fees.
- Revenue shares.
- Tax rules.
- Refund policies.
- Payout schedules.
- Payout thresholds.
- Reserve rules.
- Subscription plans.
- Enterprise plans.
- Membership plans.
- Coupons.
- Affiliates.
- Scholarships.
- Sponsorship programs.
- Sponsor funds.
- Wallet rules.
- Financial reports.
- Reconciliation.
- Unmatched payments.
- Risk flags.
- Audit logs.

All high-risk configuration changes should be audited and permission-protected.

---

## 47. Cross-Solva Financial Integration

Plan for future shared financial capabilities across:

- SolvaOne.
- Solva Academy.
- Solco.
- Solva HR.
- Solva POS.
- SolvaFlow.
- SolvaStay.

Potential shared capabilities:

- Shared customer identity.
- Shared payment profile.
- Shared wallet.
- Ecosystem credits.
- Product bundles.
- Cross-product subscription.
- Unified invoice.
- Unified receipts.
- Cross-product promotions.
- Enterprise ecosystem package.

Do not tightly couple MVP to unfinished shared wallet infrastructure.

---

## 48. MVP and Future Phasing

### MVP Financial Scope

MVP should include:

- M-Pesa STK Push.
- Basic card provider abstraction.
- Course checkout.
- Order creation.
- Payment verification.
- Enrollment entitlement.
- Receipts.
- Coupon support.
- Basic platform/instructor/academy revenue split.
- Earnings ledger.
- Payout request.
- Manual payout processing.
- Refund request.
- Scholarship entitlement.
- Basic enterprise invoice.
- Financial audit logs.
- Basic reconciliation.

### Phase 2

Phase 2 should include memberships, subscriptions, automated renewals, enterprise recurring billing, affiliate program, sponsor dashboard, advanced scholarships, automated payouts, wallet credits, advanced reconciliation, tax statements, coaching and event financials, and multi-instructor splits.

### Phase 3

Phase 3 should include multi-currency, regional mobile money, shared Solva wallet, installment plans, pay-it-forward, advanced risk engine, cross-product subscription, enterprise consolidated invoice, marketplace licensing, automated tax integration, and dedicated sponsor fund management.

---

## 49. Conceptual Data Model

This chapter introduces conceptual entities only. SQL and physical schema design should come later.

### Core Finance Entities

- `currencies`
- `payment_providers`
- `payment_provider_accounts`
- `customers`
- `billing_profiles`
- `products`
- `product_prices`
- `pricing_rules`
- `orders`
- `order_items`
- `payments`
- `payment_attempts`
- `payment_callbacks`
- `payment_reconciliations`
- `unmatched_payments`
- `receipts`
- `entitlements`

### Discount, Subscription, Invoice, and Wallet Entities

- `discounts`
- `coupons`
- `coupon_redemptions`
- `memberships`
- `membership_plans`
- `subscriptions`
- `subscription_plans`
- `subscription_events`
- `enterprise_billing_accounts`
- `invoices`
- `invoice_items`
- `invoice_payments`
- `credits`
- `wallets`
- `wallet_transactions`

### Revenue, Payout, Refund, Scholarship, Sponsor, and Tax Entities

- `revenue_share_rules`
- `revenue_allocations`
- `earnings_ledger`
- `payout_profiles`
- `payout_requests`
- `payouts`
- `payout_events`
- `reserves`
- `refunds`
- `refund_requests`
- `disputes`
- `chargebacks`
- `scholarship_programs`
- `scholarship_applications`
- `scholarship_awards`
- `sponsorship_programs`
- `sponsors`
- `sponsor_funds`
- `sponsor_fund_transactions`
- `affiliates`
- `affiliate_links`
- `affiliate_attributions`
- `affiliate_commissions`
- `tax_rules`
- `tax_transactions`
- `withholding_records`
- `financial_periods`
- `reconciliation_runs`
- `financial_adjustments`
- `financial_risk_flags`
- `finance_audit_logs`

The model should enforce ownership, relationships, immutable ledger design, tenant isolation, financial integrity, settlement, historical versioning, data retention, privacy, and approval controls.

---

## 50. Risks and Mitigations

### Risk: Finance Becomes Too Simple for the Business Model

Mitigation: Model orders, payments, entitlements, allocations, ledgers, payouts, refunds, scholarships, sponsors, and invoices separately.

### Risk: Provider Lock-In

Mitigation: Use payment provider abstraction and provider-independent order, entitlement, and ledger logic.

### Risk: Financial Confusion for Instructors

Mitigation: Provide transparent earnings ledgers, statements, reserve explanations, payout statuses, and refund impact.

### Risk: M-Pesa Reconciliation Problems

Mitigation: Build callback verification, duplicate handling, unmatched payment queue, manual claim workflow, and reconciliation reports.

### Risk: Fraud and Abuse

Mitigation: Use risk flags, payout controls, coupon limits, affiliate review, scholarship verification, and human review for serious actions.

### Risk: Tax Misconfiguration

Mitigation: Make tax rules configurable, versioned, permission-protected, and professionally reviewed.

### Risk: Sensitive Finance Data Exposure

Mitigation: Mask sensitive data, enforce role-scoped access, encrypt where appropriate, and audit access.

---

## 51. Acceptance Criteria

Chapter 9 should be considered satisfied when the blueprint supports:

- M-Pesa-first payments.
- Provider-independent payment abstraction.
- Orders separate from payments.
- Entitlements separate from enrollment.
- Flexible pricing, coupons, memberships, and subscriptions.
- Enterprise billing, invoices, and receipts.
- Revenue allocation and revenue sharing.
- Multi-instructor splits.
- Earnings ledger.
- Wallets and credits.
- Payout workflow and controls.
- Reserves and settlement.
- Refunds, disputes, and chargebacks.
- Scholarships, sponsorships, sponsor funds, and affiliate commissions.
- Marketplace, coaching, and event financials.
- Tax and withholding architecture.
- Reconciliation and unmatched payments.
- Financial reports and statements.
- Financial permissions and segregation of duties.
- Manual adjustments through ledger entries.
- Fraud and risk management.
- Financial notifications and privacy controls.
- Failure and outage handling.
- Finance admin console.
- Cross-Solva financial integration readiness.
- MVP and phased roadmap.
- Conceptual data model without SQL.

---

## 52. Dependencies for Later Chapters

Later chapters should define:

- Physical financial schema and ledger constraints.
- Payment provider contracts.
- M-Pesa API integration specification.
- Card provider selection.
- Tax policy review.
- Terms for refunds, subscriptions, scholarships, sponsorships, and affiliates.
- Accounting export requirements.
- Finance QA scenarios.
- Fraud review playbooks.
- Data retention and privacy policy for finance records.
- Cross-Solva wallet feasibility and governance.

---

## 53. Final Recommendations

Solva Academy should build finance as a transparent, auditable, M-Pesa-first, provider-independent operating layer. The platform should make payments easy for learners, earnings clear for instructors and academies, billing understandable for employers, sponsorships traceable for funders, and controls strong enough for marketplace, enterprise, and future ecosystem growth.

The strongest direction is:

- Treat M-Pesa as primary in Kenya.
- Keep orders, payments, entitlements, ledgers, and payouts separate.
- Use immutable financial records and adjustment entries.
- Make revenue sharing explicit before sale.
- Protect low-cost course economics.
- Build scholarships and sponsorships as first-class financial objects.
- Keep payout controls strong.
- Avoid provider lock-in.
- Prepare for cross-Solva finance without blocking MVP.

Chapter 9 should guide Solva Academy toward a financial system that earns user trust while supporting learners, parents, instructors, academies, employers, sponsors, affiliates, marketplace sellers, and the wider Solva ecosystem.

