import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function AdminEnterprisePage() {
  return (
    <DashboardShell>
      <PageHeading title="Enterprise oversight" description="Platform admin monitoring for organizations, internal academies, compliance usage, assignments, trainer activity, campaigns, support issues, and organization health." />
      <SectionGrid items={[
        ["Organizations", "Review workspace status without exposing one organization to another."],
        ["Internal academies", "Monitor internal academy health and visibility."],
        ["Compliance usage", "View governed compliance usage at platform scope."],
        ["Support issues", "Enterprise support issue placeholders are ready."],
      ]} />
    </DashboardShell>
  );
}
