import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function OnboardingPage() {
  return (
    <DashboardShell>
      <PageHeading title="Onboarding programmes" description="New employee, intern, graduate trainee, volunteer, and contract staff onboarding foundations for policies, courses, assessments, certificates, and acknowledgements." />
      <SectionGrid items={[
        ["Policies", "Policy acknowledgements are prepared as placeholders."],
        ["Courses", "Onboarding courses can be assigned through enterprise assignments."],
        ["Assessments", "Assessment completion connects to existing course assessment records."],
        ["Certificates", "Required certificate tracking connects to compliance records."],
      ]} />
    </DashboardShell>
  );
}
