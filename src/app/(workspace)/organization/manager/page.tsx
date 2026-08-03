import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ManagerDashboardPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: manager } = await supabase.from("enterprise_employees").select("id,organization_id").eq("user_id", user.id).limit(1).maybeSingle();
  const { data } = manager ? await supabase.from("enterprise_employees").select("id,full_name,email,learning_status,status").eq("manager_employee_id", manager.id).order("full_name") : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Manager dashboard" description="Managers see direct reports only unless broader organization permissions exist." />
      <DataTable title="Direct reports" description="Assignments, progress, overdue learners, certificates, learning hours, and department analytics are scoped to reporting lines." headers={["Name", "Email", "Learning", "Status", "Profile"]} rows={(data ?? []).map((employee) => [employee.full_name, employee.email, employee.learning_status, employee.status, employee.id])} empty="No direct reports found for this user." />
    </DashboardShell>
  );
}
