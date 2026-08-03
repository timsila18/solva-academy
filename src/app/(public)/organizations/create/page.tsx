import { createOrganizationAction } from "@/features/tenants/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

export default function CreateOrganizationPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card>
        <h1 className="text-2xl font-semibold">Create organization workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create an employer or institution workspace. Training assignments are deferred.</p>
        <form action={createOrganizationAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Organization name"><Input name="name" required /></Field>
          <Field label="Slug"><Input name="slug" required /></Field>
          <Field label="Type">
            <Select name="type" required>
              <option>Company</option><option>Church</option><option>School</option><option>NGO</option><option>Government</option><option>Hospital</option><option>SACCO</option><option>University</option><option>TVET</option>
            </Select>
          </Field>
          <Field label="Industry"><Input name="industry" /></Field>
          <Field label="Country"><Input name="country" defaultValue="KE" required /></Field>
          <Field label="County"><Input name="county" /></Field>
          <Field label="Website"><Input name="website" type="url" /></Field>
          <Field label="Employee size"><Input name="employeeSize" required /></Field>
          <Field label="Primary contact"><Input name="primaryContact" required /></Field>
          <Field label="Description"><TextArea name="description" required /></Field>
          <Button className="md:col-span-2" type="submit">Create organization</Button>
        </form>
      </Card>
    </section>
  );
}
