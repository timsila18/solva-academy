import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function AcademySupportPage() {
  return (
    <DashboardShell>
      <PageHeading title="Academy support" description="Operational support placeholders for disputes, learner support, quality issues, policy questions, and platform moderation escalation." />
      <SectionGrid items={[
        ["Learner support", "Support request records are deferred; academy staff will only see tenant-relevant requests."],
        ["Quality issues", "Quality alerts use objective metrics and reviewer comments."],
        ["Disputes", "Payment and content disputes are prepared for finance and trust workflows."],
        ["Moderation", "Community moderation remains separate from course assessment communication."],
      ]} />
    </DashboardShell>
  );
}
