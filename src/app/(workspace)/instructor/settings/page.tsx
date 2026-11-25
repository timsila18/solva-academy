import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { QuickLinks } from "@/components/dashboard/quick-links";

export default function InstructorSettingsPage() {
  return (
    <DashboardShell>
      <PageHeading
        title="Teaching settings"
        description="Your profile, privacy and course settings."
      />
      <QuickLinks
        links={[
          ["Teaching profile", "/instructor/profile"],
          ["Privacy", "/settings/privacy"],
          ["Course settings", "/instructor/courses"],
        ]}
      />
    </DashboardShell>
  );
}
