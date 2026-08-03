import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function AdminFinancePage() {
  return (
    <DashboardShell>
      <PageHeading title="Finance operations" description="Finance-scoped views for orders, payments, M-Pesa callbacks, receipts, refunds, unmatched payments, entitlements, and reconciliation." />
      <SectionGrid items={[
        ["Orders", "Search orders and order items."],
        ["Payment attempts", "Inspect initiated, successful, failed, timed-out, duplicate, and unmatched payments."],
        ["M-Pesa callbacks", "Callbacks are server-side, idempotent, and safely logged."],
        ["Receipts", "Receipt reissue does not create new payments."],
        ["Refund requests", "Refunds preserve enrollment history and require decisions."],
        ["Entitlements", "Manual grants, suspension, restoration, and revocation require reason and audit."],
        ["Payout review", "Review instructor and academy payout requests from /admin/payouts."],
      ]} />
    </DashboardShell>
  );
}
