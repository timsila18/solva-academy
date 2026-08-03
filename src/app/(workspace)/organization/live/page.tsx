import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrganizationLivePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: orgs } = await supabase.from("organizations").select("id").eq("owner_id", user.id);
  const ids = (orgs ?? []).map((org) => org.id);
  const { data } = ids.length ? await supabase.from("live_sessions").select("id,slug,title,status,starts_at,timezone,learning_assignment_id").in("organization_id", ids).order("starts_at") : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Organization live dashboard" description="Upcoming training, mandatory live sessions, department attendance, compliance sessions, no-shows, trainers, learning hours, recordings, and make-up sessions." />
      <MetricsGrid metrics={[
        { label: "Organization sessions", value: data?.length ?? 0, definition: "Sessions linked to owned organization workspaces." },
        { label: "Mandatory-linked", value: data?.filter((s) => s.learning_assignment_id).length ?? 0, definition: "Sessions linked to enterprise learning assignments." },
        { label: "Upcoming", value: data?.filter((s) => new Date(s.starts_at) > new Date()).length ?? 0, definition: "Future organization live training." },
        { label: "Completed", value: data?.filter((s) => ["ended", "recording_available"].includes(s.status)).length ?? 0, definition: "Sessions completed by status." },
      ]} />
      <div className="mt-6"><DataTable title="Organization sessions" description="Managers see only authorized sessions through RLS." headers={["Title", "Starts", "Status", "Open"]} rows={(data ?? []).map((s) => [s.title, new Date(s.starts_at).toLocaleString("en-KE", { timeZone: s.timezone }), <Badge key={s.status}>{s.status}</Badge>, <ButtonLink key={s.id} href={`/live/${s.slug}`} size="sm" variant="outline">Open</ButtonLink>])} empty="No organization live sessions yet." /></div>
    </DashboardShell>
  );
}
