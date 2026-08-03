import { AiResultCard } from "@/components/ai/ai-result-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, TextArea } from "@/components/ui/form-fields";
import { askAiTutorAction } from "@/features/ai/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiResponseByRequest } from "@/lib/ai/queries";

export default async function AiTutorPage({ searchParams }: { searchParams?: Promise<{ request?: string; generated?: string; error?: string }> }) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const result = await getAiResponseByRequest(params?.request);

  return (
    <DashboardShell>
      <PageHeading title="AI tutor" description="Ask course-aware questions. Solco Intelligence uses authorized learning context and records safety decisions for review." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Ask a learning question</CardTitle>
            <CardDescription>Keep personal, payment, and private contact information out of prompts.</CardDescription>
          </CardHeader>
          <form action={askAiTutorAction} className="grid gap-4">
            <Field label="Question">
              <TextArea name="question" placeholder="Explain PAYE relief in simple steps..." required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Course ID" hint="Optional authorized context">
                <Input name="courseId" placeholder="uuid" />
              </Field>
              <Field label="Language">
                <Input name="language" defaultValue="en" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="childSafetyMode" value="true" />
              Child-safety mode
            </label>
            <Button type="submit">Ask Solco</Button>
          </form>
        </Card>
        <AiResultCard result={result} />
      </div>
    </DashboardShell>
  );
}
