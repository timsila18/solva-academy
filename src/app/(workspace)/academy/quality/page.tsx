import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyQualityPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id").eq("owner_id", user.id);
  const ids = (academies ?? []).map((academy) => academy.id);
  const { data } = ids.length ? await supabase.from("academy_quality_metrics").select("*").in("academy_id", ids).order("metric_date", { ascending: false }).limit(100) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Academy quality" description="Objective quality signals for course quality, review turnaround, assessment turnaround, completion, certificates, freshness, and reviewer comments." />
      <DataTable title="Quality metrics" description="Learner satisfaction remains a placeholder until real reviews exist." headers={["Date", "Quality", "Review hrs", "Assessment hrs", "Completion", "Certificate", "Freshness", "Comments"]} rows={(data ?? []).map((item) => [new Date(item.metric_date).toLocaleDateString("en-KE"), item.course_quality_score ?? "-", item.review_turnaround_hours ?? "-", item.assessment_turnaround_hours ?? "-", item.completion_rate ?? "-", item.certificate_rate ?? "-", item.content_freshness_days ?? "-", item.reviewer_comment_count])} empty="No academy quality metrics yet." />
    </DashboardShell>
  );
}
