import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LiveCalendarPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("live_sessions").select("id,slug,title,starts_at,ends_at,timezone,status,visibility").order("starts_at", { ascending: true }).limit(100);
  return (
    <DashboardShell>
      <PageHeading title="Solco calendar" description="Agenda foundation for day, week, month, upcoming, instructor, academy, organization, campaign, mandatory-learning, and completed/cancelled filters." />
      <DataTable title="Upcoming sessions" description="Times are stored canonically and displayed with the session timezone." headers={["Session", "Starts", "Status", "Visibility", "Calendar"]} rows={(data ?? []).map((session) => [session.title, new Date(session.starts_at).toLocaleString("en-KE", { timeZone: session.timezone }), <Badge key={session.status}>{session.status}</Badge>, session.visibility, <ButtonLink key={session.id} href={`/api/live/sessions/${session.id}/ics`} size="sm" variant="outline">ICS</ButtonLink>])} empty="No visible live sessions yet." />
    </DashboardShell>
  );
}
