import { createEnterpriseSkillAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrganizationSkillsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_skills").select("name,category,status,created_at").eq("organization_id", org.id).order("name") : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Organization skills" description="Manage organization skill catalogues, required and desired skills, department and role skills, learning gaps, and future competency mapping." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Skills catalogue" description="Skills may link to the platform catalogue or remain organization-specific." headers={["Skill", "Category", "Status", "Created"]} rows={(data ?? []).map((s) => [s.name, s.category ?? "-", <Badge key={s.status}>{s.status}</Badge>, new Date(s.created_at).toLocaleDateString("en-KE")])} empty="No organization skills yet." />
        <Card>
          <h2 className="font-semibold">Create skill</h2>
          <form action={createEnterpriseSkillAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="Category"><Input name="category" /></Field>
            <Field label="Description"><TextArea name="description" /></Field>
            <Button type="submit" disabled={!org}>Create skill</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
