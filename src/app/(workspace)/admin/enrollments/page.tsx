import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function AdminEnrollmentsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Enrollment management" description="Inspect entitlement source, access dates, progress, completion, version migration status, and certificate status." />
      <SectionGrid items={[
        ["Access grants", "Manual grants require permission, reason, and audit."],
        ["Suspensions", "Access changes preserve history."],
        ["Progress recalculation", "Completion rules can be recalculated safely."],
        ["Certificate status", "Issued, corrected, replaced, revoked, and expired records are preserved."],
      ]} />
    </DashboardShell>
  );
}
