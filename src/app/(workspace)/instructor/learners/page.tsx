import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUserOrRedirect } from "@/lib/authorization/server";

export default async function InstructorLearnersPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: courses } = await supabase.from("courses").select("id,title").eq("owner_id", user.id);
  const courseIds = (courses ?? []).map((course) => course.id);
  const { data: summaries } = courseIds.length
    ? await supabase.from("learner_course_activity_summary").select("learner_id,course_id,progress_percentage,last_activity_at,risk_flags,updated_at").in("course_id", courseIds).order("updated_at", { ascending: false })
    : { data: [] };
  const courseTitle = new Map((courses ?? []).map((course) => [course.id, course.title]));

  return (
    <DashboardShell>
      <PageHeading title="Learner management" description="Instructor visibility is limited to learners enrolled in assigned or owned courses by RLS and server-side queries." />
      <DataTable
        title="Assigned learners"
        description="Progress, activity, and risk flags use objective system data only."
        headers={["Learner", "Course", "Progress", "Last activity", "Risk flags"]}
        rows={(summaries ?? []).map((summary) => [
          <span key={summary.learner_id} className="font-mono text-xs">{summary.learner_id}</span>,
          courseTitle.get(summary.course_id) ?? summary.course_id,
          `${summary.progress_percentage ?? 0}%`,
          summary.last_activity_at ? new Date(summary.last_activity_at).toLocaleDateString("en-KE") : "No activity yet",
          summary.risk_flags?.length ? summary.risk_flags.join(", ") : <Badge key="clear">No flags</Badge>,
        ])}
        empty="No enrolled learners are visible for this instructor yet."
      />
    </DashboardShell>
  );
}
