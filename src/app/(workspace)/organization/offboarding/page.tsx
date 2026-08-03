import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function OffboardingPage() {
  return (
    <DashboardShell>
      <PageHeading title="Offboarding foundation" description="Final learning records, certificate archive, knowledge transfer placeholder, and manager checklist placeholder without account deletion automation." />
      <SectionGrid items={[
        ["Learning record", "Employee learning history remains available for organization transcripts."],
        ["Certificate archive", "Certificate monitoring preserves historical records."],
        ["Knowledge transfer", "Placeholder for future offboarding workflows."],
        ["Account status", "No automated account deletion is implemented."],
      ]} />
    </DashboardShell>
  );
}
