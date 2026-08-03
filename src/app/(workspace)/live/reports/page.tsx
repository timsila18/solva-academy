import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";

export default function LiveReportsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Live attendance reports" description="Session, course, organization, department, compliance, learner, instructor, and learning-hour report foundations with CSV, Excel, and PDF export fields." />
      <DataTable title="Report types" description="Reports respect tenant and participant scope." headers={["Report", "Scope"]} rows={[
        ["Session attendance", "Session hosts and authorized managers"],
        ["Course live attendance", "Course instructors and academy staff"],
        ["Organization attendance", "Organization admins and managers"],
        ["Compliance attendance", "Organization compliance managers"],
        ["Learner history", "Learner, direct manager, and authorized staff"],
      ]} empty="No report definitions." />
    </DashboardShell>
  );
}
