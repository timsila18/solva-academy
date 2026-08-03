import { AiResultCard } from "@/components/ai/ai-result-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Select, TextArea } from "@/components/ui/form-fields";
import { draftFeedbackAction } from "@/features/ai/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiResponseByRequest } from "@/lib/ai/queries";

export default async function FeedbackAiPage({ searchParams }: { searchParams?: Promise<{ request?: string }> }) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const result = await getAiResponseByRequest(params?.request);
  return (
    <DashboardShell>
      <PageHeading title="AI feedback assistant" description="Draft feedback for instructor review. Sensitive or child-related feedback is marked for careful human review." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Feedback draft</CardTitle><CardDescription>Do not paste private learner contact, identity, health, or payment information.</CardDescription></CardHeader>
          <form action={draftFeedbackAction} className="grid gap-4">
            <Field label="Tone"><Select name="tone"><option value="encouraging">Encouraging</option><option value="direct">Direct</option><option value="formal">Formal</option><option value="child_safe">Child-safe</option></Select></Field>
            <Field label="Rubric"><TextArea name="rubric" /></Field>
            <Field label="Learner work"><TextArea name="learnerWork" required /></Field>
            <Button type="submit">Draft feedback</Button>
          </form>
        </Card>
        <AiResultCard result={result} />
      </div>
    </DashboardShell>
  );
}
