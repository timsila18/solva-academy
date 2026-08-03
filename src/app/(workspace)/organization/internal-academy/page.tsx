import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function InternalAcademyPage() {
  return (
    <DashboardShell>
      <PageHeading title="Internal academy" description="Organizations can operate private internal academies for internal courses, trainers, employee assignments, tracking, and internal certificates." />
      <SectionGrid items={[
        ["Internal courses", "Internal course ownership connects to the existing course builder without public marketplace exposure."],
        ["Trainers", "Corporate, department, compliance, HR, guest, and reviewer trainer scopes are organization-limited."],
        ["Certificates", "Internal certificates remain organization-scoped."],
        ["Visibility", "Internal academies are invisible publicly unless explicitly published."],
      ]} />
    </DashboardShell>
  );
}
