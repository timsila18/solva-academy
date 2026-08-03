import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateComplianceScore } from "@/lib/enterprise/analytics";

export default async function CompliancePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_compliance_records").select("compliance_type,status,risk_level,due_at,expires_at").eq("organization_id", org.id).order("due_at", { ascending: true }) : { data: [] };
  const rows = (data ?? []) as Array<{ compliance_type: string; status: "assigned" | "completed" | "overdue" | "expiring" | "expired" | "waived" | "failed"; risk_level: "low" | "normal" | "high" | "critical"; due_at: string | null; expires_at: string | null }>;
  return (
    <DashboardShell>
      <PageHeading title="Compliance training" description="Monitor mandatory compliance learning, certificates, risk areas, overdue training, expiring records, and future renewals." />
      <MetricsGrid metrics={[
        { label: "Assigned", value: rows.filter((r) => r.status === "assigned").length, definition: "Compliance records assigned but not completed." },
        { label: "Completed", value: rows.filter((r) => r.status === "completed").length, definition: "Completed compliance learning records." },
        { label: "Overdue or expired", value: rows.filter((r) => ["overdue", "expired"].includes(r.status)).length, definition: "Compliance items requiring attention." },
        { label: "Compliance score", value: `${calculateComplianceScore(rows.map((r) => ({ status: r.status, riskLevel: r.risk_level })))}%`, definition: "Completed applicable records with critical risk penalty." },
      ]} />
      <div className="mt-6"><DataTable title="Compliance records" description="Health & Safety, Data Protection, Anti-Corruption, Code of Conduct, Cyber Security, and custom compliance records." headers={["Type", "Status", "Risk", "Due", "Expires"]} rows={rows.map((r) => [r.compliance_type, <Badge key={r.status}>{r.status}</Badge>, r.risk_level, r.due_at ? new Date(r.due_at).toLocaleDateString("en-KE") : "-", r.expires_at ? new Date(r.expires_at).toLocaleDateString("en-KE") : "-"])} empty="No compliance records yet." /></div>
    </DashboardShell>
  );
}
