import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyLivePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id").eq("owner_id", user.id);
  const ids = (academies ?? []).map((a) => a.id);
  const { data } = ids.length ? await supabase.from("live_sessions").select("id,slug,title,status,starts_at,timezone,child_safety_enabled").in("academy_id", ids).order("starts_at") : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Academy live dashboard" description="All academy sessions, hosts, upcoming classes, registrations, attendance, recordings, child-focused sessions, incidents, host performance, and quality alerts." />
      <MetricsGrid metrics={[
        { label: "Academy sessions", value: data?.length ?? 0, definition: "Sessions linked to owned academies." },
        { label: "Upcoming", value: data?.filter((s) => new Date(s.starts_at) > new Date()).length ?? 0, definition: "Future academy sessions." },
        { label: "Child-focused", value: data?.filter((s) => s.child_safety_enabled).length ?? 0, definition: "Sessions with child-safety controls enabled." },
        { label: "Live now", value: data?.filter((s) => s.status === "live").length ?? 0, definition: "Academy sessions currently marked live by authorized operations." },
      ]} />
      <div className="mt-6"><DataTable title="Academy sessions" description="Financial data remains separate and permission-controlled." headers={["Title", "Starts", "Status", "Open"]} rows={(data ?? []).map((s) => [s.title, new Date(s.starts_at).toLocaleString("en-KE", { timeZone: s.timezone }), <Badge key={s.status}>{s.status}</Badge>, <ButtonLink key={s.id} href={`/live/${s.slug}`} size="sm" variant="outline">Open</ButtonLink>])} empty="No academy live sessions yet." /></div>
    </DashboardShell>
  );
}
