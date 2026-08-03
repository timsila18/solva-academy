import { AiResultCard } from "@/components/ai/ai-result-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, TextArea } from "@/components/ui/form-fields";
import { createCourseDraftAction } from "@/features/ai/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiResponseByRequest } from "@/lib/ai/queries";

export default async function CourseCreatorAiPage({ searchParams }: { searchParams?: Promise<{ request?: string }> }) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const result = await getAiResponseByRequest(params?.request);
  return (
    <DashboardShell>
      <PageHeading title="AI course creator" description="Generate course outlines and lesson ideas as editable drafts for instructor review." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Course draft</CardTitle><CardDescription>No course is published or sold from this AI draft.</CardDescription></CardHeader>
          <form action={createCourseDraftAction} className="grid gap-4">
            <Field label="Topic"><Input name="topic" required /></Field>
            <Field label="Audience"><Input name="audience" required /></Field>
            <Field label="Level"><Input name="level" defaultValue="beginner" required /></Field>
            <Field label="Learning outcomes"><TextArea name="learningOutcomes" /></Field>
            <Field label="Constraints"><TextArea name="constraints" /></Field>
            <Button type="submit">Create draft</Button>
          </form>
        </Card>
        <AiResultCard result={result} />
      </div>
    </DashboardShell>
  );
}
