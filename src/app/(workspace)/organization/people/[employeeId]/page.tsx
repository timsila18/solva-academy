import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function EmployeeProfilePage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = await params;
  const supabase = await createServerSupabaseClient();
  const [employee, assignments, compliance, transcripts] = await Promise.all([
    supabase.from("enterprise_employees").select("*").eq("id", employeeId).maybeSingle(),
    supabase.from("enterprise_learning_assignments").select("title,status,mandatory,due_at").eq("target_employee_id", employeeId).order("created_at", { ascending: false }),
    supabase.from("enterprise_compliance_records").select("compliance_type,status,due_at,expires_at").eq("employee_id", employeeId),
    supabase.from("enterprise_transcripts").select("generated_at,export_status").eq("employee_id", employeeId).order("generated_at", { ascending: false }),
  ]);
  return (
    <DashboardShell>
      <PageHeading title={employee.data?.full_name ?? "Employee profile"} description="Organization-owned learning transcript view: assignments, progress, certificates, skills, compliance, and activity without payroll-sensitive information." />
      <div className="grid gap-5">
        <DataTable title="Profile summary" description="Basic learning directory details." headers={["Field", "Value"]} rows={[["Email", employee.data?.email ?? "-"], ["Role", employee.data?.role_title ?? "-"], ["Location", employee.data?.location ?? "-"], ["Learning status", <Badge key={employee.data?.learning_status ?? "none"}>{employee.data?.learning_status ?? "none"}</Badge>]]} empty="Employee not found." />
        <DataTable title="Assignments" description="Mandatory and optional learning assigned to this employee." headers={["Title", "Mandatory", "Status", "Due"]} rows={(assignments.data ?? []).map((a) => [a.title, a.mandatory ? "Mandatory" : "Optional", <Badge key={a.status}>{a.status}</Badge>, a.due_at ? new Date(a.due_at).toLocaleDateString("en-KE") : "No due date"])} empty="No assignments." />
        <DataTable title="Compliance" description="Compliance training, certificates, renewals, and risk areas." headers={["Type", "Status", "Due", "Expires"]} rows={(compliance.data ?? []).map((c) => [c.compliance_type, <Badge key={c.status}>{c.status}</Badge>, c.due_at ? new Date(c.due_at).toLocaleDateString("en-KE") : "-", c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-KE") : "-"])} empty="No compliance records." />
        <DataTable title="Transcripts" description="Generated employee transcript snapshots." headers={["Generated", "Status"]} rows={(transcripts.data ?? []).map((t) => [new Date(t.generated_at).toLocaleDateString("en-KE"), t.export_status])} empty="No transcript snapshots." />
      </div>
    </DashboardShell>
  );
}
