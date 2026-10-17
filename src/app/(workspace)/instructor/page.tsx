import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { formatMoney } from "@/lib/payments/money";

export default async function InstructorDashboardPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();

  const [
    ownedCourses,
    teamCourses,
    submissions,
    certificates,
    earnings,
    payouts,
    profile,
    notifications,
  ] = await Promise.all([
    supabase.from("courses").select("id,title,status").eq("owner_id", user.id),
    supabase.from("course_team_members").select("course_id").eq("user_id", user.id).eq("status", "active"),
    supabase.from("assignment_submissions").select("id,status,submitted_at").eq("status", "submitted"),
    supabase.from("certificates").select("id,status").eq("status", "issued"),
    supabase.from("earnings_ledger").select("net_amount_minor,gross_amount_minor,status,currency").eq("beneficiary_user_id", user.id),
    supabase.from("payout_requests").select("id,status,amount_minor,currency,created_at").eq("requester_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("instructor_profiles").select("verification_level,biography,photo_path,skill_ids,status").eq("user_id", user.id).maybeSingle(),
    supabase.from("instructor_notifications").select("title,priority,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const courses = ownedCourses.data ?? [];
  const courseIds = Array.from(new Set([...courses.map((course) => course.id), ...(teamCourses.data ?? []).map((course) => course.course_id)]));
  const scopedEnrollments = courseIds.length
    ? await supabase.from("enrollments").select("id,course_id,status,progress_percentage,created_at").in("course_id", courseIds)
    : { data: [] };
  const ledger = earnings.data ?? [];
  const net = ledger.reduce((sum, entry) => sum + (entry.net_amount_minor ?? 0), 0);

  const profileCompletion = [
    profile.data?.biography ? null : "Add biography",
    profile.data?.photo_path ? null : "Add profile photo",
    (profile.data?.skill_ids?.length ?? 0) > 0 ? null : "Add skills",
    courses.some((course) => course.status === "published") ? null : "Publish first course",
    profile.data?.verification_level && profile.data.verification_level !== "unverified" ? null : "Continue verification",
  ].filter(Boolean);

  return (
    <DashboardShell>
      <PageHeading title="Teaching" description="Your courses, learners, and earnings." />
      <QuickLinks links={[
        ["Courses", "/instructor/courses"],
        ["Learners", "/instructor/learners"],
        ["Assignments", "/instructor/assignments"],
        ["Quizzes", "/instructor/quizzes"],
        ["Earnings", "/instructor/earnings"],
        ["Payouts", "/instructor/payouts"],
        ["Analytics", "/instructor/analytics"],
        ["Profile", "/instructor/profile"],
      ]} />
      <MetricsGrid metrics={[
        { label: "Published courses", value: courses.filter((course) => course.status === "published").length, definition: "Owned instructor courses currently published." },
        { label: "Draft courses", value: courses.filter((course) => course.status === "draft").length, definition: "Owned courses not visible to learners." },
        { label: "Current learners", value: scopedEnrollments.data?.length ?? 0, definition: "Enrollments in courses owned by or assigned to this instructor." },
        { label: "Net earnings", value: formatMoney(net, ledger[0]?.currency ?? "KES"), definition: "Finalized ledger net earnings visible to this instructor." },
        { label: "Assignments awaiting review", value: submissions.data?.length ?? 0, definition: "Submitted assignment records available through assigned-course RLS." },
        { label: "Certificates issued", value: certificates.data?.length ?? 0, definition: "Issued certificate records visible to this instructor." },
        { label: "Pending payouts", value: payouts.data?.filter((payout) => ["submitted", "under_review"].includes(payout.status)).length ?? 0, definition: "Payout requests not yet paid, rejected, or cancelled." },
        { label: "Profile actions", value: profileCompletion.length, definition: "Objective instructor success items still needing attention." },
      ]} />
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <DataTable
          title="Recent payout requests"
          description="Finance actions are audited and payout automation remains deferred."
          headers={["Amount", "Status", "Requested"]}
          rows={(payouts.data ?? []).map((payout) => [formatMoney(payout.amount_minor, payout.currency), <Badge key={payout.status}>{payout.status}</Badge>, new Date(payout.created_at).toLocaleDateString("en-KE")])}
          empty="No payout requests yet."
        />
        <DataTable
          title="Instructor success"
          description="Actionable guidance based on missing profile, verification, and course signals."
          headers={["Action", "Status"]}
          rows={profileCompletion.map((item) => [item, <Badge key={String(item)}>Needed</Badge>])}
          empty="No profile completion blockers found from available data."
        />
        <DataTable
          title="Notifications"
          description="Instructor-specific notifications for enrollments, grading, payouts, reviews, and policy changes."
          headers={["Title", "Priority", "Date"]}
          rows={(notifications.data ?? []).map((item) => [item.title, <Badge key={item.priority}>{item.priority}</Badge>, new Date(item.created_at).toLocaleDateString("en-KE")])}
          empty="No instructor notifications yet."
        />
        <DataTable
          title="Course status"
          description="Owned courses only; assigned course team access appears in the course management routes."
          headers={["Course", "Status"]}
          rows={courses.slice(0, 6).map((course) => [course.title, <Badge key={course.status}>{course.status}</Badge>])}
          empty="No owned courses yet."
        />
      </div>
    </DashboardShell>
  );
}
