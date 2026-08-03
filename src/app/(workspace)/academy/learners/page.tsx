import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyLearnersPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id").eq("owner_id", user.id);
  const ids = (academies ?? []).map((academy) => academy.id);
  const { data } = ids.length ? await supabase.from("learner_course_activity_summary").select("learner_id,course_id,progress_percentage,last_activity_at,risk_flags,academy_id").in("academy_id", ids).order("updated_at", { ascending: false }).limit(100) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Academy learners" description="Academy-level learner outcomes, progress, support flags, assessment status, certificates, and expiring access signals." />
      <DataTable title="Learners" description="Academy admins see only learner records in their academy tenant." headers={["Learner", "Course", "Progress", "Last activity", "Flags"]} rows={(data ?? []).map((item) => [<span key={item.learner_id} className="font-mono text-xs">{item.learner_id}</span>, item.course_id, `${item.progress_percentage}%`, item.last_activity_at ? new Date(item.last_activity_at).toLocaleDateString("en-KE") : "No activity", item.risk_flags?.length ? item.risk_flags.join(", ") : <Badge key="clear">No flags</Badge>])} empty="No academy learner activity summaries yet." />
    </DashboardShell>
  );
}
