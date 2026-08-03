import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function EnterpriseSettingsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Enterprise settings" description="Organization workspace configuration, import rules, assignment defaults, compliance defaults, transcript settings, and notification controls." />
      <SectionGrid items={[
        ["Assignment defaults", "Due dates, reminders, mandatory defaults, and certificate requirements."],
        ["Import settings", "Required fields, duplicate handling, department and manager mapping."],
        ["Compliance defaults", "Risk levels, renewal windows, and certificate requirements."],
        ["Privacy", "Employees see only their learning; managers see direct reports."],
      ]} />
    </DashboardShell>
  );
}
