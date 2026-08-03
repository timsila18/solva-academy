import { AiResultCard } from "@/components/ai/ai-result-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";
import { semanticSearchAction } from "@/features/ai/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiResponseByRequest } from "@/lib/ai/queries";

export default async function AiSearchPage({ searchParams }: { searchParams?: Promise<{ request?: string }> }) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const result = await getAiResponseByRequest(params?.request);

  return (
    <DashboardShell>
      <PageHeading title="Semantic search" description="Search authorized schools, categories, courses, academy knowledge, organization learning records, and indexed resources." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Search knowledge</CardTitle>
            <CardDescription>Results respect tenant isolation and index visibility.</CardDescription>
          </CardHeader>
          <form action={semanticSearchAction} className="grid gap-4">
            <Field label="Search query">
              <Input name="query" placeholder="What should I learn before payroll reporting?" required />
            </Field>
            <Button type="submit">Search</Button>
          </form>
        </Card>
        <AiResultCard result={result} />
      </div>
    </DashboardShell>
  );
}
