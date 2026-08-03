import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LearnerLivePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("live_session_registrations").select("status,session_id,live_sessions(slug,title,starts_at,timezone,status)").eq("user_id", user.id).order("registered_at", { ascending: false }).limit(100);
  return (
    <DashboardShell>
      <PageHeading title="My live sessions" description="Upcoming sessions, today’s sessions, join buttons, registration status, waitlist status, missed sessions, recordings, attendance, make-up sessions, reminders, and resources." />
      <DataTable title="Registered sessions" description="Only your registrations and attendance are visible." headers={["Session", "Starts", "Registration", "Session status", "Open"]} rows={(data ?? []).map((row) => {
        const session = Array.isArray(row.live_sessions) ? row.live_sessions[0] : row.live_sessions;
        return [session?.title ?? row.session_id, session?.starts_at ? new Date(session.starts_at).toLocaleString("en-KE", { timeZone: session.timezone }) : "-", <Badge key={row.status}>{row.status}</Badge>, session?.status ?? "-", session?.slug ? <ButtonLink key={session.slug} href={`/live/${session.slug}`} size="sm" variant="outline">Open</ButtonLink> : "-"];
      })} empty="No live session registrations yet." />
    </DashboardShell>
  );
}
