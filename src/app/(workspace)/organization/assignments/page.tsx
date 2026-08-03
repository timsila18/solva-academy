import { createLearningAssignmentAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrganizationAssignmentsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_learning_assignments").select("id,title,target_type,mandatory,priority,status,due_at").eq("organization_id", org.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Learning assignments" description="Assign mandatory or optional learning to employees, departments, teams, roles, or the whole organization with due dates, reminders, certificates, and audit events." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Assignments" description="Every status transition is audit-backed by assignment events." headers={["Title", "Target", "Required", "Priority", "Status", "Due"]} rows={(data ?? []).map((a) => [a.title, a.target_type, a.mandatory ? "Mandatory" : "Optional", a.priority, <Badge key={a.status}>{a.status}</Badge>, a.due_at ? new Date(a.due_at).toLocaleDateString("en-KE") : "-"])} empty="No enterprise assignments yet." />
        <Card>
          <h2 className="font-semibold">Create assignment</h2>
          <form action={createLearningAssignmentAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Course ID"><Input name="courseId" /></Field>
            <Field label="Target type"><Select name="targetType" defaultValue="organization"><option value="organization">Organization</option><option value="department">Department</option><option value="team">Team</option><option value="employee">Employee</option><option value="role">Role</option></Select></Field>
            <Field label="Target employee ID"><Input name="targetEmployeeId" /></Field>
            <Field label="Target department ID"><Input name="targetDepartmentId" /></Field>
            <Field label="Target team ID"><Input name="targetTeamId" /></Field>
            <Field label="Target role"><Input name="targetRole" /></Field>
            <Field label="Mandatory"><Select name="mandatory" defaultValue="true"><option value="true">Mandatory</option><option value="false">Optional</option></Select></Field>
            <Field label="Priority"><Select name="priority" defaultValue="normal"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></Select></Field>
            <Field label="Due date"><Input name="dueAt" type="datetime-local" /></Field>
            <Field label="Certificate required"><Select name="certificateRequired" defaultValue="false"><option value="false">No</option><option value="true">Yes</option></Select></Field>
            <Field label="Reason"><TextArea name="reason" /></Field>
            <Button type="submit" disabled={!org}>Assign learning</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
