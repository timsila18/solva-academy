import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUserOrRedirect } from "@/lib/authorization/server";

export default async function InstructorNotificationsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("instructor_notifications").select("title,body,priority,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);

  return (
    <DashboardShell>
      <PageHeading title="Instructor notifications" description="New enrollments, submissions, quiz reviews, completions, certificates, payouts, review comments, academy invitations, and policy changes." />
      <DataTable title="Notifications" description="Communication preferences are respected by the notification service layer." headers={["Title", "Body", "Priority", "Date"]} rows={(data ?? []).map((item) => [item.title, item.body, <Badge key={item.priority}>{item.priority}</Badge>, new Date(item.created_at).toLocaleDateString("en-KE")])} empty="No instructor notifications yet." />
    </DashboardShell>
  );
}
