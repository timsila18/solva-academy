import { AiResultCard } from "@/components/ai/ai-result-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createAssessmentDraftAction } from "@/features/ai/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiResponseByRequest } from "@/lib/ai/queries";

export default async function AssessmentAiPage({ searchParams }: { searchParams?: Promise<{ request?: string }> }) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const result = await getAiResponseByRequest(params?.request);
  return (
    <DashboardShell>
      <PageHeading title="AI assessments" description="Draft quizzes, assignments, and rubrics. Instructors must review before attaching them to courses." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Assessment draft</CardTitle><CardDescription>Use this for formative drafting, not automatic grading decisions.</CardDescription></CardHeader>
          <form action={createAssessmentDraftAction} className="grid gap-4">
            <Field label="Type"><Select name="assessmentType"><option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="rubric">Rubric</option></Select></Field>
            <Field label="Topic"><Input name="topic" required /></Field>
            <Field label="Outcomes"><TextArea name="outcomes" required /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Difficulty"><Select name="difficulty"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></Select></Field>
              <Field label="Items"><Input name="itemCount" type="number" defaultValue="5" min="1" max="20" /></Field>
            </div>
            <Button type="submit">Create draft</Button>
          </form>
        </Card>
        <AiResultCard result={result} />
      </div>
    </DashboardShell>
  );
}
