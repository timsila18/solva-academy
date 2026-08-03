import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorAnalyticsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("instructor_dashboard_metrics").select("*").eq("instructor_id", user.id).order("metric_date", { ascending: false }).limit(1).maybeSingle();

  return (
    <DashboardShell>
      <PageHeading title="Instructor analytics" description="Tenant-aware metric definitions for enrollments, engagement, grading, certificates, and revenue. Export remains a placeholder." />
      <MetricsGrid metrics={[
        { label: "Learners", value: data?.learners ?? 0, definition: "Unique enrollments visible for instructor-owned or assigned courses." },
        { label: "Assignments awaiting review", value: data?.assignments_awaiting_review ?? 0, definition: "Submitted assignments not yet published as reviewed." },
        { label: "Quiz attempts", value: data?.quiz_attempts ?? 0, definition: "Quiz attempts submitted within visible instructor course scope." },
        { label: "Certificates issued", value: data?.certificates_issued ?? 0, definition: "Issued certificates for instructor-visible courses." },
      ]} />
      <div className="mt-6">
        <DataTable title="Metric definitions" description="Every metric is defined to avoid misleading dashboard interpretation." headers={["Metric", "Definition"]} rows={[
          ["Completion rate", "Completed enrollments divided by active enrollments for visible courses."],
          ["Average progress", "Average learner progress percentage from activity summaries."],
          ["Grading turnaround", "Hours between submission and published grading activity."],
          ["Revenue", "Finalized earnings ledger only; pending checkout attempts are excluded."],
        ]} empty="Metric definitions unavailable." />
      </div>
    </DashboardShell>
  );
}
