import { createImportPreviewAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function EmployeeImportPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("employee_import_jobs").select("id,source_type,status,total_rows,valid_rows,invalid_rows,duplicate_emails,duplicate_employee_numbers,created_at").eq("organization_id", org.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Employee import" description="CSV, Excel, API, and future HR integration foundation with duplicate checks, department and manager mapping, preview reports, and rollback status." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Import jobs" description="Preview before import; rollback state is preserved where practical." headers={["Source", "Status", "Rows", "Valid", "Invalid", "Duplicates", "Created"]} rows={(data ?? []).map((job) => [job.source_type, <Badge key={job.status}>{job.status}</Badge>, job.total_rows, job.valid_rows, job.invalid_rows, job.duplicate_emails + job.duplicate_employee_numbers, new Date(job.created_at).toLocaleDateString("en-KE")])} empty="No import jobs yet." />
        <Card>
          <h2 className="font-semibold">Create import preview</h2>
          <form action={createImportPreviewAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Source"><Select name="sourceType" defaultValue="csv"><option value="csv">CSV</option><option value="excel">Excel</option><option value="api">Bulk API</option><option value="hr_integration">Future HR integration</option></Select></Field>
            <Field label="Total rows"><Input name="totalRows" type="number" min="0" defaultValue="0" /></Field>
            <Field label="Valid rows"><Input name="validRows" type="number" min="0" defaultValue="0" /></Field>
            <Field label="Invalid rows"><Input name="invalidRows" type="number" min="0" defaultValue="0" /></Field>
            <Field label="Duplicate emails"><Input name="duplicateEmails" type="number" min="0" defaultValue="0" /></Field>
            <Field label="Duplicate employee numbers"><Input name="duplicateEmployeeNumbers" type="number" min="0" defaultValue="0" /></Field>
            <Button type="submit" disabled={!org}>Save preview report</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
