import { inviteWorkspaceMemberAction } from "@/features/tenants/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";

export default function OrganizationTeamPage() {
  return (
    <DashboardShell>
      <PageHeading title="Organization team" description="Invite organization admins, HR managers, learning managers, department managers, trainers, finance, support, and employees." />
      <Card>
        <form action={inviteWorkspaceMemberAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Workspace ID"><Input name="workspaceId" placeholder="Supabase workspace UUID" required /></Field>
          <Field label="Organization ID"><Input name="organizationId" placeholder="Optional organization UUID" /></Field>
          <Field label="Email"><Input name="email" type="email" required /></Field>
          <Field label="Role ID"><Input name="roleId" placeholder="Role UUID from Admin roles" required /></Field>
          <Field label="Role label">
            <Select name="roleLabel" defaultValue="Employee">
              {["Organization Admin","HR Manager","Learning Manager","Department Manager","Corporate Trainer","Finance","Support","Employee"].map((role) => <option key={role}>{role}</option>)}
            </Select>
          </Field>
          <Button className="md:col-span-2" type="submit">Send invitation</Button>
        </form>
      </Card>
      <div className="mt-6"><EmptyState title="No organization members loaded" description="Invitation acceptance assigns workspace membership and scoped roles with audit logging." /></div>
    </DashboardShell>
  );
}
