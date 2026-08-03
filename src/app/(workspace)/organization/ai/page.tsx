import { AiResultCard } from "@/components/ai/ai-result-card";
import { DataTable } from "@/components/dashboard/data-table";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Select, TextArea } from "@/components/ui/form-fields";
import { enterpriseInsightAction } from "@/features/ai/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getAiResponseByRequest } from "@/lib/ai/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrganizationAiPage({ searchParams }: { searchParams?: Promise<{ request?: string }> }) {
  const user = await requireUserOrRedirect();
  const params = await searchParams;
  const result = await getAiResponseByRequest(params?.request);
  const supabase = await createServerSupabaseClient();
  const { data: organizations } = await supabase.from("organizations").select("id,name,status").eq("owner_id", user.id).order("created_at", { ascending: false });
  const activeOrganization = organizations?.[0];

  return (
    <DashboardShell>
      <PageHeading title="Enterprise AI" description="Generate organization-scoped learning insights, compliance summaries, and skills recommendations without crossing tenant boundaries." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Ask about enterprise learning</CardTitle>
            <CardDescription>Outputs are advisory and require administrator review.</CardDescription>
          </CardHeader>
          {activeOrganization ? (
            <form action={enterpriseInsightAction} className="grid gap-4">
              <input type="hidden" name="organizationId" value={activeOrganization.id} />
              <Field label="Metric focus">
                <Select name="metricFocus">
                  <option value="completion">Completion</option>
                  <option value="compliance">Compliance</option>
                  <option value="skills">Skills</option>
                  <option value="assignments">Assignments</option>
                  <option value="certificates">Certificates</option>
                  <option value="campaigns">Campaigns</option>
                </Select>
              </Field>
              <Field label="Question">
                <TextArea name="question" placeholder="Which departments need attention before the compliance deadline?" required />
              </Field>
              <Button type="submit">Generate insight</Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">Create an organization workspace before using enterprise AI.</p>
          )}
        </Card>
        <AiResultCard result={result} />
      </div>
      <div className="mt-6">
        <DataTable title="Available organizations" description="The insight engine only uses organization-scoped records." headers={["Organization", "Status"]} rows={(organizations ?? []).map((org) => [org.name, org.status])} empty="No organization workspace found." />
      </div>
    </DashboardShell>
  );
}
