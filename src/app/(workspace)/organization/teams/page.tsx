import { createTeamAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrganizationTeamsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_teams").select("id,name,team_type,department_id,manager_employee_id,status").eq("organization_id", org.id).order("name") : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Teams" description="Create teams, projects, committees, and taskforces that can receive assignments, announcements, reports, certificates, and progress tracking." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Teams" description="Team membership remains organization-scoped." headers={["Name", "Type", "Department", "Manager", "Status"]} rows={(data ?? []).map((team) => [team.name, team.team_type, team.department_id ?? "-", team.manager_employee_id ?? "-", <Badge key={team.status}>{team.status}</Badge>])} empty="No teams yet." />
        <Card>
          <h2 className="font-semibold">Create team</h2>
          <form action={createTeamAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="Type"><Select name="teamType" defaultValue="team"><option value="team">Team</option><option value="project">Project</option><option value="committee">Committee</option><option value="taskforce">Taskforce</option></Select></Field>
            <Field label="Department ID"><Input name="departmentId" /></Field>
            <Field label="Manager employee ID"><Input name="managerEmployeeId" /></Field>
            <Field label="Description"><TextArea name="description" /></Field>
            <Button type="submit" disabled={!org}>Create team</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
