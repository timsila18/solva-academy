import { AiResultCard } from "@/components/ai/ai-result-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { accessibilityAssistAction, translateContentAction } from "@/features/ai/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiResponseByRequest } from "@/lib/ai/queries";

export default async function AiStudyPage({ searchParams }: { searchParams?: Promise<{ request?: string }> }) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const result = await getAiResponseByRequest(params?.request);

  return (
    <DashboardShell>
      <PageHeading title="AI study tools" description="Translate, summarize, simplify, caption, and adapt learning content while keeping drafts under learner control." />
      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Translation</CardTitle>
            <CardDescription>Create a reviewable translation draft.</CardDescription>
          </CardHeader>
          <form action={translateContentAction} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="From"><Input name="sourceLanguage" defaultValue="en" /></Field>
              <Field label="To"><Input name="targetLanguage" defaultValue="sw" /></Field>
            </div>
            <Field label="Text"><TextArea name="text" required /></Field>
            <Button type="submit">Translate</Button>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>Adapt content for easier reading or assistive technology.</CardDescription>
          </CardHeader>
          <form action={accessibilityAssistAction} className="grid gap-4">
            <Field label="Task">
              <Select name="task" defaultValue="plain_language">
                <option value="simplify">Simplify</option>
                <option value="summarize">Summarize</option>
                <option value="caption">Caption</option>
                <option value="reading_level">Reading level</option>
                <option value="screen_reader">Screen reader</option>
                <option value="plain_language">Plain language</option>
              </Select>
            </Field>
            <Field label="Content"><TextArea name="content" required /></Field>
            <Button type="submit">Adapt content</Button>
          </form>
        </Card>
        <AiResultCard result={result} />
      </div>
    </DashboardShell>
  );
}
