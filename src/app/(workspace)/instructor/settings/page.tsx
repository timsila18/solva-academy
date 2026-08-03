import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function InstructorSettingsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Instructor settings" description="Teaching preferences, communication controls, grading defaults, schedule placeholders, and instructor account status." />
      <SectionGrid items={[
        ["Communication", "Course announcements, assignment comments, feedback, and system notifications are allowed; unrestricted messaging remains disabled."],
        ["Schedule", "Teaching schedule placeholders are ready for Solco and future calendar integrations."],
        ["Assessment defaults", "Default grading preferences can be connected to future assessment settings."],
        ["Privacy", "Public profile controls remain separate from financial and private account data."],
      ]} />
    </DashboardShell>
  );
}
