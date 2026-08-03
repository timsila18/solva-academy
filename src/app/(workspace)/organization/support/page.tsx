import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function EnterpriseSupportPage() {
  return (
    <DashboardShell>
      <PageHeading title="Enterprise support" description="Support issue placeholders for imports, assignments, compliance, certificates, reporting, and workspace administration." />
      <SectionGrid items={[
        ["Import support", "Validate import reports and mapping failures."],
        ["Assignment support", "Investigate learning assignment issues."],
        ["Compliance support", "Review overdue, expiring, and failed compliance records."],
        ["Reporting support", "Assist with transcript and enterprise report exports."],
      ]} />
    </DashboardShell>
  );
}
