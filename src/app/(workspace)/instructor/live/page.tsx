import { correctAttendanceAction } from "@/features/live/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/dashboard/data-table";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorLivePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const [sessions, registrations, attendance, recordings, incidents] = await Promise.all([
    supabase.from("live_sessions").select("id,slug,title,status,starts_at,timezone").eq("host_id", user.id).order("starts_at", { ascending: true }).limit(50),
    supabase.from("live_session_registrations").select("id,status").limit(100),
    supabase.from("live_session_attendance").select("id,status").limit(100),
    supabase.from("live_session_recordings").select("id,status").limit(100),
    supabase.from("live_session_incidents").select("id,status,severity").limit(100),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <DashboardShell>
      <PageHeading title="Instructor live dashboard" description="Upcoming sessions, today’s sessions, drafts, recurring series, registrations, waitlists, attendance, recordings, resources, incidents, analytics, and session creation." />
      <div className="mb-5 flex flex-wrap gap-2"><ButtonLink href="/live/create">Create session</ButtonLink><ButtonLink href="/live/calendar" variant="outline">Calendar</ButtonLink></div>
      <MetricsGrid metrics={[
        { label: "Upcoming", value: sessions.data?.filter((s) => new Date(s.starts_at) > new Date()).length ?? 0, definition: "Host sessions scheduled in the future." },
        { label: "Today", value: sessions.data?.filter((s) => s.starts_at.slice(0, 10) === today).length ?? 0, definition: "Host sessions starting today." },
        { label: "Registrations", value: registrations.data?.length ?? 0, definition: "Visible registration records for instructor sessions." },
        { label: "Incidents", value: incidents.data?.filter((i) => i.status !== "resolved").length ?? 0, definition: "Open or unresolved live-session incident records." },
        { label: "Attendance records", value: attendance.data?.length ?? 0, definition: "Visible attendance records generated from join, leave, and correction events." },
        { label: "Recordings", value: recordings.data?.length ?? 0, definition: "Visible recording records, including processing and available states." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_22rem]">
        <DataTable title="Sessions" description="Owned or hosted instructor sessions only." headers={["Title", "Starts", "Status", "Open"]} rows={(sessions.data ?? []).map((s) => [s.title, new Date(s.starts_at).toLocaleString("en-KE", { timeZone: s.timezone }), <Badge key={s.status}>{s.status}</Badge>, <ButtonLink key={s.id} href={`/live/${s.slug}`} size="sm" variant="outline">Open</ButtonLink>])} empty="No instructor sessions yet." />
        <Card>
          <h2 className="font-semibold">Attendance correction</h2>
          <form action={correctAttendanceAction} className="mt-4 grid gap-3">
            <Field label="Attendance ID"><Input name="attendanceId" required /></Field>
            <Field label="Original status"><Input name="originalStatus" required /></Field>
            <Field label="New status"><Select name="newStatus" defaultValue="manually_confirmed"><option value="present">Present</option><option value="partially_present">Partially present</option><option value="late">Late</option><option value="excused">Excused</option><option value="absent">Absent</option><option value="technical_issue">Technical issue</option><option value="manually_confirmed">Manually confirmed</option></Select></Field>
            <Field label="Reason"><TextArea name="reason" required /></Field>
            <Button type="submit">Correct attendance</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
