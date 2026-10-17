import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { formatMoney } from "@/lib/payments/money";

export default async function AcademyDashboardPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id,name,status,visibility,workspace_id").eq("owner_id", user.id).order("updated_at", { ascending: false });
  const academyIds = (academies ?? []).map((academy) => academy.id);
  const [courses, members, metrics, payouts, quality] = await Promise.all([
    academyIds.length ? supabase.from("courses").select("id,title,status,academy_id").in("academy_id", academyIds) : { data: [] },
    academyIds.length ? supabase.from("academy_members").select("id,academy_id,role_label,status").in("academy_id", academyIds) : { data: [] },
    academyIds.length ? supabase.from("academy_dashboard_metrics").select("*").in("academy_id", academyIds).order("metric_date", { ascending: false }).limit(1) : { data: [] },
    academyIds.length ? supabase.from("payout_requests").select("id,academy_id,status,amount_minor,currency,created_at").in("academy_id", academyIds).order("created_at", { ascending: false }).limit(5) : { data: [] },
    academyIds.length ? supabase.from("academy_quality_metrics").select("*").in("academy_id", academyIds).order("metric_date", { ascending: false }).limit(5) : { data: [] },
  ]);
  const metric = metrics.data?.[0];
  const payoutPending = (payouts.data ?? []).filter((payout) => ["submitted", "under_review"].includes(payout.status)).reduce((sum, payout) => sum + payout.amount_minor, 0);

  return (
    <DashboardShell>
      <PageHeading title="My academy" description="Manage your courses, team, and learners." />
      <QuickLinks links={[
        ["Courses", "/academy/courses"],
        ["Learners", "/academy/learners"],
        ["Team", "/academy/team"],
        ["Analytics", "/academy/analytics"],
        ["Revenue", "/academy/revenue"],
        ["Payouts", "/academy/payouts"],
        ["Policies", "/academy/policies"],
        ["Storefront", "/academy/storefront"],
      ]} />
      <MetricsGrid metrics={[
        { label: "Academies", value: academies?.length ?? 0, definition: "Academies owned by the current account." },
        { label: "Published courses", value: courses.data?.filter((course) => course.status === "published").length ?? metric?.published_courses ?? 0, definition: "Academy courses currently published." },
        { label: "Active staff", value: members.data?.filter((member) => member.status === "active").length ?? metric?.active_instructors ?? 0, definition: "Active academy team memberships visible to this owner." },
        { label: "Pending payouts", value: formatMoney(payoutPending, payouts.data?.[0]?.currency ?? "KES"), definition: "Submitted or under-review payout requests for owned academies." },
        { label: "Learners", value: metric?.learners ?? 0, definition: "Learners from academy dashboard metrics, not synthetic estimates." },
        { label: "Certificates", value: metric?.certificates_issued ?? 0, definition: "Issued certificates counted by academy metrics." },
        { label: "Quality records", value: quality.data?.length ?? 0, definition: "Objective quality metric records available for owned academies." },
        { label: "Draft courses", value: courses.data?.filter((course) => course.status === "draft").length ?? metric?.draft_courses ?? 0, definition: "Academy drafts not publicly discoverable." },
      ]} />
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <DataTable title="Owned academies" description="No artificial KPIs are displayed." headers={["Academy", "Status", "Visibility"]} rows={(academies ?? []).map((academy) => [academy.name, <Badge key={academy.status}>{academy.status}</Badge>, academy.visibility])} empty="No academy workspace is owned by this account yet." />
        <DataTable title="Quality alerts" description="Objective academy health signals only." headers={["Metric date", "Completion", "Assessment turnaround", "Freshness"]} rows={(quality.data ?? []).map((item) => [new Date(item.metric_date).toLocaleDateString("en-KE"), item.completion_rate ?? "-", item.assessment_turnaround_hours ?? "-", item.content_freshness_days ?? "-"])} empty="No quality metric records yet." />
      </div>
    </DashboardShell>
  );
}
