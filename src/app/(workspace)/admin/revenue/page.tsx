import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { getBillingDashboard } from "@/lib/platform-ops/queries";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { formatMoney } from "@/lib/payments/money";

export default async function AdminRevenuePage() {
  await requirePlatformAdmin();
  const data = await getBillingDashboard();
  return (
    <DashboardShell>
      <PageHeading title="Revenue operations" description="Track revenue sharing, earnings ledger, platform revenue, instructor earnings, academy earnings, payout eligibility, and reversible adjustments." />
      <MetricsGrid metrics={[
        { label: "Earnings rows", value: data.earnings.length, definition: "Recent normalized earnings entries." },
        { label: "Pending earnings", value: formatMoney(data.earnings.filter((e) => e.status === "pending").reduce((sum, e) => sum + Number(e.net_minor ?? 0), 0)), definition: "Pending net earnings from visible records." },
        { label: "Payout txns", value: data.payouts.length, definition: "Payout transaction records." },
        { label: "Paid payouts", value: data.payouts.filter((p) => p.status === "paid").length, definition: "Payout transactions marked paid." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DataTable title="Earnings" description="Calculations store snapshots for reproducibility." headers={["Beneficiary", "Status", "Net"]} rows={data.earnings.map((earning) => [earning.beneficiary_type, <Badge key={earning.status}>{earning.status}</Badge>, formatMoney(earning.net_minor, earning.currency)])} empty="No earnings entries." />
        <DataTable title="Payout transactions" description="Manual payout methods are active; provider adapters are prepared." headers={["Method", "Status", "Amount"]} rows={data.payouts.map((payout) => [payout.method, <Badge key={payout.status}>{payout.status}</Badge>, formatMoney(payout.amount_minor, payout.currency)])} empty="No payout transactions." />
      </div>
    </DashboardShell>
  );
}
