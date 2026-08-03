import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function EnterpriseAuditPage() {
  return (
    <DashboardShell>
      <PageHeading title="Enterprise audit" description="Audit assignments, campaigns, departments, imports, trainers, learning paths, compliance actions, transcripts, certificates, and announcements." />
      <SectionGrid items={[
        ["Assignments", "Assignment creation and status transitions write events and audit logs."],
        ["Imports", "Import preview and results are preserved."],
        ["Compliance", "Compliance records support governed review."],
        ["Transcripts", "Transcript generation is tracked by generated_by and generated_at."],
      ]} />
    </DashboardShell>
  );
}
