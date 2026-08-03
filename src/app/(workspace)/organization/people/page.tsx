import { createEmployeeAction } from "@/features/enterprise/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrganizationPeoplePage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  const { data } = org ? await supabase.from("enterprise_employees").select("id,full_name,email,employee_number,department_id,manager_employee_id,role_title,location,learning_status,status").eq("organization_id", org.id).order("full_name") : { data: [] };
  return (
    <DashboardShell>
      <PageHeading title="Employee directory" description="Search-ready employee learning records with department, manager, location, status, assignments, certificates, skills, and learning history without payroll data." />
      <div className="mb-5"><ButtonLink href="/organization/import" variant="outline">Import employees</ButtonLink></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Employees" description="No payroll or HR-sensitive data is stored here." headers={["Name", "Email", "Employee #", "Role", "Learning", "Status", "Profile"]} rows={(data ?? []).map((employee) => [employee.full_name, employee.email, employee.employee_number ?? "-", employee.role_title ?? "-", <Badge key={employee.learning_status}>{employee.learning_status}</Badge>, <Badge key={employee.status}>{employee.status}</Badge>, <ButtonLink key={employee.id} href={`/organization/people/${employee.id}`} size="sm" variant="outline">Open</ButtonLink>])} empty="No employees yet." />
        <Card>
          <h2 className="font-semibold">Add employee</h2>
          <form action={createEmployeeAction} className="mt-4 grid gap-4">
            <Field label="Organization ID"><Input name="organizationId" defaultValue={org?.id} required /></Field>
            <Field label="Full name"><Input name="fullName" required /></Field>
            <Field label="Email"><Input name="email" type="email" required /></Field>
            <Field label="Employee number"><Input name="employeeNumber" /></Field>
            <Field label="Department ID"><Input name="departmentId" /></Field>
            <Field label="Manager employee ID"><Input name="managerEmployeeId" /></Field>
            <Field label="Role title"><Input name="roleTitle" /></Field>
            <Field label="Location"><Input name="location" /></Field>
            <Field label="Type"><Select name="employmentType" defaultValue="employee"><option value="employee">Employee</option><option value="contractor">Contractor</option><option value="intern">Intern</option><option value="volunteer">Volunteer</option><option value="student">Student</option><option value="external_trainee">External trainee</option></Select></Field>
            <Button type="submit" disabled={!org}>Add employee</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
