import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function EnterpriseReportsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_reports").select("report_type,status,export_format,created_at").eq("organization_id", org.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Enterprise reports" description="Completion, compliance, certificates, assignments, departments, learning hours, trainer activity, course performance, and employee transcript export foundation." />
      <DataTable title="Reports" description="PDF, Excel, and CSV export fields are prepared; full BI is deferred." headers={["Type", "Status", "Format", "Created"]} rows={(data ?? []).map((r) => [r.report_type, <Badge key={r.status}>{r.status}</Badge>, r.export_format ?? "Not selected", new Date(r.created_at).toLocaleDateString("en-KE")])} empty="No enterprise reports yet." />
    </DashboardShell>
  );
}
