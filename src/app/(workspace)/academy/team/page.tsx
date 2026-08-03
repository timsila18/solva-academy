import { inviteWorkspaceMemberAction } from "@/features/tenants/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";

export default function AcademyTeamPage() {
  return (
    <DashboardShell>
      <PageHeading title="Academy team" description="Invite academy admins, tutors, assistants, finance managers, content managers, moderators, reviewers, marketers, and support agents." />
      <Card>
        <form action={inviteWorkspaceMemberAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Workspace ID"><Input name="workspaceId" placeholder="Supabase workspace UUID" required /></Field>
          <Field label="Academy ID"><Input name="academyId" placeholder="Optional academy UUID" /></Field>
          <Field label="Email"><Input name="email" type="email" required /></Field>
          <Field label="Role ID"><Input name="roleId" placeholder="Role UUID from Admin roles" required /></Field>
          <Field label="Role label">
            <Select name="roleLabel" defaultValue="Tutor">
              {["Academy Admin","Tutor","Teaching Assistant","Finance Manager","Content Manager","Moderator","Reviewer","Marketing Manager","Support Agent"].map((role) => <option key={role}>{role}</option>)}
            </Select>
          </Field>
          <Button className="md:col-span-2" type="submit">Send invitation</Button>
        </form>
      </Card>
      <div className="mt-6"><EmptyState title="No team members loaded" description="Accepted invitations join the workspace, assign a scoped role, and write audit logs." /></div>
    </DashboardShell>
  );
}
