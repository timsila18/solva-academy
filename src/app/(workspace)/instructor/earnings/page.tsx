import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/payments/money";

export default async function InstructorEarningsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("earnings_ledger").select("id,course_id,amount_minor,gross_amount_minor,platform_fee_minor,tax_minor,net_amount_minor,currency,status,earned_at,payout_reference").eq("beneficiary_user_id", user.id).order("earned_at", { ascending: false }).limit(100);
  const rows = data ?? [];
  const currency = rows[0]?.currency ?? "KES";
  const gross = rows.reduce((sum, row) => sum + row.gross_amount_minor, 0);
  const net = rows.reduce((sum, row) => sum + row.net_amount_minor, 0);
  const eligible = rows.filter((row) => row.status === "eligible").reduce((sum, row) => sum + row.net_amount_minor, 0);
  const paid = rows.filter((row) => row.status === "paid").reduce((sum, row) => sum + row.net_amount_minor, 0);

  return (
    <DashboardShell>
      <PageHeading title="Instructor earnings" description="Finalized ledger entries prepared for Prompt 9 revenue share and payout automation. No estimated or fake earnings are displayed." />
      <MetricsGrid metrics={[
        { label: "Gross sales", value: formatMoney(gross, currency), definition: "Gross finalized sales attributed to visible ledger entries." },
        { label: "Net earnings", value: formatMoney(net, currency), definition: "Gross minus platform fee, taxes, and refund adjustments." },
        { label: "Eligible payout", value: formatMoney(eligible, currency), definition: "Ledger net amount marked eligible for payout request." },
        { label: "Paid payouts", value: formatMoney(paid, currency), definition: "Ledger amount already associated with paid payout status." },
      ]} />
      <div className="mt-6">
        <DataTable title="Earnings ledger" description="Instructor-facing ledger prepared for payouts without automating revenue sharing." headers={["Earned", "Course", "Gross", "Fees", "Net", "Status", "Reference"]} rows={rows.map((row) => [new Date(row.earned_at).toLocaleDateString("en-KE"), row.course_id ?? "Manual", formatMoney(row.gross_amount_minor, row.currency), formatMoney(row.platform_fee_minor + row.tax_minor, row.currency), formatMoney(row.net_amount_minor, row.currency), <Badge key={row.status}>{row.status}</Badge>, row.payout_reference ?? "-"])} empty="No finalized earnings ledger entries yet." />
      </div>
    </DashboardShell>
  );
}
