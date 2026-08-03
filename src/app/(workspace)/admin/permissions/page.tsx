import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Card } from "@/components/ui/card";

const permissions = ["profile.view.own", "workspace.switch.assigned", "academy.manage.assigned", "organization.manage.assigned", "role.manage.platform", "settings.manage.platform", "audit.view.platform"];

export default function AdminPermissionsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Permissions" description="Permission checks use resource.action.scope codes and centralized authorization helpers." />
      <Card>
        <ul className="grid gap-2 font-mono text-sm">
          {permissions.map((permission) => <li key={permission}>{permission}</li>)}
        </ul>
      </Card>
    </DashboardShell>
  );
}
