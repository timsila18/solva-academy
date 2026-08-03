import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/payments/money";

export default async function AcademyRevenuePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id").eq("owner_id", user.id);
  const ids = (academies ?? []).map((academy) => academy.id);
  const { data } = ids.length ? await supabase.from("earnings_ledger").select("id,academy_id,course_id,gross_amount_minor,net_amount_minor,currency,status,earned_at").in("academy_id", ids).order("earned_at", { ascending: false }).limit(100) : { data: [] };
  const rows = data ?? [];
  const currency = rows[0]?.currency ?? "KES";
  return (
    <DashboardShell>
      <PageHeading title="Academy revenue" description="Academy owners and finance managers see finalized academy financial data only according to scoped permissions." />
      <MetricsGrid metrics={[
        { label: "Gross sales", value: formatMoney(rows.reduce((s, r) => s + r.gross_amount_minor, 0), currency), definition: "Gross finalized academy ledger sales." },
        { label: "Net revenue", value: formatMoney(rows.reduce((s, r) => s + r.net_amount_minor, 0), currency), definition: "Net ledger revenue after deductions." },
        { label: "Eligible", value: formatMoney(rows.filter((r) => r.status === "eligible").reduce((s, r) => s + r.net_amount_minor, 0), currency), definition: "Eligible payout balance from ledger entries." },
        { label: "Paid", value: formatMoney(rows.filter((r) => r.status === "paid").reduce((s, r) => s + r.net_amount_minor, 0), currency), definition: "Ledger entries already paid." },
      ]} />
      <div className="mt-6"><DataTable title="Academy ledger" description="No instructor sees academy-wide financial data without academy finance permissions." headers={["Earned", "Course", "Gross", "Net", "Status"]} rows={rows.map((row) => [new Date(row.earned_at).toLocaleDateString("en-KE"), row.course_id ?? "-", formatMoney(row.gross_amount_minor, row.currency), formatMoney(row.net_amount_minor, row.currency), <Badge key={row.status}>{row.status}</Badge>])} empty="No academy ledger entries yet." /></div>
    </DashboardShell>
  );
}
