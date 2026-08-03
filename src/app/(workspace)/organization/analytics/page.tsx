import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";

export default function EnterpriseAnalyticsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Enterprise analytics" description="Metric definitions for completion, compliance, departments, courses, assignments, learning hours, skills, certificates, participation, engagement, and trends." />
      <DataTable title="Metric definitions" description="No metric is shown without a definition." headers={["Metric", "Definition"]} rows={[
        ["Completion", "Completed applicable assignments divided by active applicable assignments."],
        ["Compliance score", "Completed compliance records divided by applicable records, adjusted for critical risk."],
        ["Department comparison", "Department-level completion and compliance by organization department."],
        ["Learning hours", "Course learning minutes converted to hours after progress tracking exists."],
        ["Skills progress", "Accepted skill evidence and completed learning tied to organization skill requirements."],
        ["Certificate monitoring", "Issued, expiring, expired, revoked, and renewal-required certificate records."],
      ]} empty="No metric definitions." />
    </DashboardShell>
  );
}
