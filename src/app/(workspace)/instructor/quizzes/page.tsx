import { recordGradingActivityAction } from "@/features/operations/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InstructorQuizzesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("quiz_attempt_answers").select("id,attempt_id,question_id,score,feedback,updated_at").order("updated_at", { ascending: false }).limit(50);

  return (
    <DashboardShell>
      <PageHeading title="Quiz manual review" description="Manual review workspace for question responses, scores, feedback, publishing, and audit-backed review records." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Manual review queue" description="Only visible attempt answers appear according to enrollment and grading policies." headers={["Answer", "Attempt", "Question", "Score", "Updated"]} rows={(data ?? []).map((item) => [item.id, item.attempt_id, item.question_id, item.score ?? "Not scored", new Date(item.updated_at).toLocaleDateString("en-KE")])} empty="No quiz answers require manual review." />
        <Card>
          <h2 className="font-semibold">Record quiz grading</h2>
          <form action={recordGradingActivityAction} className="mt-4 grid gap-4">
            <Field label="Course ID"><Input name="courseId" /></Field>
            <Field label="Quiz answer ID"><Input name="quizAttemptAnswerId" required /></Field>
            <Field label="Activity"><Select name="activityType" defaultValue="quiz_score_drafted"><option value="quiz_score_drafted">Draft score</option><option value="quiz_score_published">Publish score</option></Select></Field>
            <Field label="Score"><Input name="score" type="number" step="0.01" /></Field>
            <Field label="Max score"><Input name="maxScore" type="number" step="0.01" /></Field>
            <Field label="Feedback"><TextArea name="learnerFeedback" /></Field>
            <Field label="Status"><Select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></Select></Field>
            <Button type="submit">Save quiz review</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
