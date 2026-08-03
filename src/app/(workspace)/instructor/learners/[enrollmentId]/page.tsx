import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorLearnerDetailPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params;
  const supabase = await createServerSupabaseClient();
  const [progress, quizzes, assignments, certificates] = await Promise.all([
    supabase.from("lesson_progress").select("lesson_id,status,progress_percentage,updated_at").eq("enrollment_id", enrollmentId).order("updated_at", { ascending: false }),
    supabase.from("quiz_attempts").select("quiz_id,status,score,max_score,submitted_at").eq("enrollment_id", enrollmentId).order("started_at", { ascending: false }),
    supabase.from("assignment_submissions").select("assignment_id,status,submitted_at,updated_at").eq("enrollment_id", enrollmentId).order("updated_at", { ascending: false }),
    supabase.from("certificates").select("certificate_number,status,issued_at").eq("enrollment_id", enrollmentId).order("issued_at", { ascending: false }),
  ]);

  return (
    <DashboardShell>
      <PageHeading title="Learner detail" description="Course-relevant progress, assessments, feedback records, certificates, and activity history for an instructor-visible enrollment." />
      <div className="grid gap-5">
        <DataTable title="Lesson progress" description="Completed lessons and timeline data." headers={["Lesson", "Status", "Progress", "Updated"]} rows={(progress.data ?? []).map((item) => [item.lesson_id, item.status, `${item.progress_percentage}%`, new Date(item.updated_at).toLocaleDateString("en-KE")])} empty="No lesson progress yet." />
        <DataTable title="Quiz attempts" description="Submitted quiz attempts and scores." headers={["Quiz", "Status", "Score", "Submitted"]} rows={(quizzes.data ?? []).map((item) => [item.quiz_id, item.status, `${item.score ?? "-"} / ${item.max_score ?? "-"}`, item.submitted_at ? new Date(item.submitted_at).toLocaleDateString("en-KE") : "Not submitted"])} empty="No quiz attempts yet." />
        <DataTable title="Assignment submissions" description="Assignments, statuses, and review readiness." headers={["Assignment", "Status", "Submitted", "Updated"]} rows={(assignments.data ?? []).map((item) => [item.assignment_id, item.status, item.submitted_at ? new Date(item.submitted_at).toLocaleDateString("en-KE") : "Not submitted", new Date(item.updated_at).toLocaleDateString("en-KE")])} empty="No assignment submissions yet." />
        <DataTable title="Certificates" description="Issued, revoked, corrected, and pending certificate records." headers={["Certificate", "Status", "Issued"]} rows={(certificates.data ?? []).map((item) => [item.certificate_number, item.status, item.issued_at ? new Date(item.issued_at).toLocaleDateString("en-KE") : "Not issued"])} empty="No certificate records yet." />
      </div>
    </DashboardShell>
  );
}
