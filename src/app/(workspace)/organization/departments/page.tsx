import { createDepartmentAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrganizationDepartmentsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("organization_departments").select("id,name,parent_id,manager_id,cost_center,status").eq("organization_id", org.id).order("display_order") : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Departments" description="Build hierarchical departments with managers, cost center placeholders, learning coordinators, employees, and department-specific learning." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Department hierarchy" description="Child departments preserve organization tenant boundaries." headers={["Name", "Parent", "Manager", "Cost center", "Status"]} rows={(data ?? []).map((d) => [d.name, d.parent_id ?? "Top level", d.manager_id ?? "Not assigned", d.cost_center ?? "-", <Badge key={d.status}>{d.status}</Badge>])} empty="No departments yet." />
        <Card>
          <h2 className="font-semibold">Create department</h2>
          <form action={createDepartmentAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="Parent ID"><Input name="parentId" /></Field>
            <Field label="Manager user ID"><Input name="managerId" /></Field>
            <Field label="Learning coordinator ID"><Input name="learningCoordinatorId" /></Field>
            <Field label="Cost center"><Input name="costCenter" /></Field>
            <Field label="Description"><TextArea name="description" /></Field>
            <Field label="Status"><Select name="status" defaultValue="active"><option value="active">Active</option><option value="archived">Archived</option></Select></Field>
            <Button type="submit" disabled={!org}>Create department</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
