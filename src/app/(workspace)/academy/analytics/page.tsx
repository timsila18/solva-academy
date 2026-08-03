import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyAnalyticsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id").eq("owner_id", user.id);
  const ids = (academies ?? []).map((academy) => academy.id);
  const { data } = ids.length ? await supabase.from("academy_dashboard_metrics").select("*").in("academy_id", ids).order("metric_date", { ascending: false }).limit(1).maybeSingle() : { data: null };
  return (
    <DashboardShell>
      <PageHeading title="Academy analytics" description="Tenant-aware analytics for learners, courses, assignments, certificates, revenue, active instructors, and completion." />
      <MetricsGrid metrics={[
        { label: "Published courses", value: data?.published_courses ?? 0, definition: "Published courses counted within academy scope." },
        { label: "Learners", value: data?.learners ?? 0, definition: "Academy learner enrollments counted from tenant-safe records." },
        { label: "Assignments awaiting review", value: data?.assignments_awaiting_review ?? 0, definition: "Submitted academy assignments awaiting grading." },
        { label: "Certificates issued", value: data?.certificates_issued ?? 0, definition: "Issued academy certificates counted by metric snapshot." },
      ]} />
      <div className="mt-6"><DataTable title="Definitions" description="Metric definitions remain visible for QA and operations." headers={["Metric", "Definition"]} rows={[["Net revenue", "Finalized academy ledger net revenue only."], ["Completion", "Completed enrollments divided by active academy enrollments."], ["Active instructors", "Active academy team members with teaching roles."], ["Quality", "Objective review, assessment turnaround, completion, certificate, and freshness indicators."]]} empty="No definitions available." /></div>
    </DashboardShell>
  );
}
