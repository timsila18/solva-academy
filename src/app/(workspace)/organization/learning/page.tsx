import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function OrganizationLearningPage() {
  return (
    <DashboardShell>
      <PageHeading title="Enterprise learning" description="Organization-specific content, optional and mandatory learning, internal courses, learning campaigns, onboarding, and compliance routes." />
      <SectionGrid items={[
        ["Mandatory learning", "Create mandatory assignments from /organization/assignments."],
        ["Optional learning", "Optional assignments use the same assignment engine with mandatory set to false."],
        ["Organization content", "Internal academy content remains organization-scoped."],
        ["Succession foundation", "Learning paths and skills prepare future succession learning."],
      ]} />
    </DashboardShell>
  );
}
