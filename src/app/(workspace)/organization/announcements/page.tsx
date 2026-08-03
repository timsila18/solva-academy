import { createAnnouncementAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AnnouncementsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_announcements").select("title,target_type,priority,published_at,created_at").eq("organization_id", org.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Announcements" description="Send organization, department, team, employee, campaign, and compliance messages while respecting notification preferences." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Announcements" description="Only real announcement records are shown." headers={["Title", "Target", "Priority", "Published"]} rows={(data ?? []).map((a) => [a.title, a.target_type, <Badge key={a.priority}>{a.priority}</Badge>, a.published_at ? new Date(a.published_at).toLocaleDateString("en-KE") : "Draft"])} empty="No announcements yet." />
        <Card>
          <h2 className="font-semibold">Create announcement</h2>
          <form action={createAnnouncementAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Body"><TextArea name="body" required /></Field>
            <Field label="Target"><Select name="targetType" defaultValue="organization"><option value="organization">Organization</option><option value="department">Department</option><option value="team">Team</option><option value="employee">Employee</option></Select></Field>
            <Field label="Department ID"><Input name="departmentId" /></Field>
            <Field label="Team ID"><Input name="teamId" /></Field>
            <Field label="Employee ID"><Input name="employeeId" /></Field>
            <Field label="Priority"><Select name="priority" defaultValue="normal"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></Select></Field>
            <Field label="Publish now"><Select name="publishNow" defaultValue="true"><option value="true">Yes</option><option value="false">Draft</option></Select></Field>
            <Button type="submit" disabled={!org}>Publish announcement</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
