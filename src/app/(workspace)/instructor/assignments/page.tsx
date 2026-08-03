import { recordGradingActivityAction } from "@/features/operations/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorAssignmentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("assignment_submissions").select("id,enrollment_id,assignment_id,status,submitted_at").order("submitted_at", { ascending: true }).limit(50);

  return (
    <DashboardShell>
      <PageHeading title="Assignment review" description="Review pending submissions, draft feedback, publish grades, return work, and keep private grading notes hidden from learners." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Submission queue" description="Visible rows are restricted by assignment/course permissions." headers={["Submission", "Assignment", "Status", "Submitted"]} rows={(data ?? []).map((item) => [item.id, item.assignment_id, item.status, item.submitted_at ? new Date(item.submitted_at).toLocaleDateString("en-KE") : "Draft"])} empty="No assignment submissions awaiting review." />
        <Card>
          <h2 className="font-semibold">Record grading activity</h2>
          <form action={recordGradingActivityAction} className="mt-4 grid gap-4">
            <Field label="Course ID"><Input name="courseId" /></Field>
            <Field label="Enrollment ID"><Input name="enrollmentId" /></Field>
            <Field label="Submission ID"><Input name="assignmentSubmissionId" /></Field>
            <Field label="Activity"><Select name="activityType" defaultValue="assignment_feedback_drafted"><option value="assignment_feedback_drafted">Draft feedback</option><option value="assignment_grade_published">Publish grade</option><option value="assignment_returned">Return work</option><option value="private_note_added">Private note</option></Select></Field>
            <Field label="Score"><Input name="score" type="number" step="0.01" /></Field>
            <Field label="Max score"><Input name="maxScore" type="number" step="0.01" /></Field>
            <Field label="Learner feedback"><TextArea name="learnerFeedback" /></Field>
            <Field label="Private note"><TextArea name="privateNote" /></Field>
            <Field label="Status"><Select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option><option value="returned">Returned</option></Select></Field>
            <Button type="submit">Save grading record</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
