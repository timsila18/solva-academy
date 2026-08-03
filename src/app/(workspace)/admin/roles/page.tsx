import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const roles = ["Learner", "Instructor", "Academy Owner", "Organization Administrator", "Platform Administrator", "Super Admin", "Founding Super Admin"];

export default function AdminRolesPage() {
  return (
    <DashboardShell>
      <PageHeading title="Roles" description="System roles are database-seeded and protected by policy. Custom role creation is an extension point." />
      <Card className="flex flex-wrap gap-2">
        {roles.map((role) => <Badge key={role}>{role}</Badge>)}
      </Card>
    </DashboardShell>
  );
}
