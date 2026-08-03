import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { SectionGrid } from "@/components/dashboard/section-grid";

export default function InstructorReviewsPage() {
  return (
    <DashboardShell>
      <PageHeading title="Reviews" description="Review monitoring placeholder for learner satisfaction, course review responses, quality comments, and future dispute workflows." />
      <SectionGrid items={[
        ["Course reviews", "Real learner reviews will appear after review collection is implemented."],
        ["Quality comments", "Reviewer comments remain available through course review workflows."],
        ["Disputes", "Dispute investigation is prepared for later trust and safety workflows."],
        ["Response guidance", "Instructor success recommendations will use objective review signals only."],
      ]} />
    </DashboardShell>
  );
}
