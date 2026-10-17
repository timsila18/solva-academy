import { createOrganizationAction } from "@/features/tenants/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CreateOrganizationPage() {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return <section className="mx-auto max-w-lg px-4 py-12"><h1 className="text-2xl font-semibold">Learning for your organization</h1><p className="mt-3 text-muted-foreground">Create an account or sign in to set up your organization.</p><div className="mt-6 flex gap-5"><Link href="/auth/sign-up?intent=organization" className="text-primary underline">Create account</Link><Link href="/auth/sign-in?next=%2Forganizations%2Fcreate" className="text-primary underline">Sign in</Link></div></section>;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card>
        <h1 className="text-2xl font-semibold">Set up your organization</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tell us about your organization and who will manage its learning.</p>
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
