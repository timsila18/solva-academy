import { submitAcademyApplicationAction } from "@/features/tenants/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function StartAcademyPage() {
  const supabase = await createServerSupabaseClient();
  const { data: schools, error } = await supabase
    .from("schools")
    .select("id,name")
    .eq("visibility", "public")
    .in("status", ["published", "active"])
    .order("display_order")
    .order("name");
  const schoolsAvailable = !error && Boolean(schools?.length);
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card>
        <h1 className="text-2xl font-semibold">Start your academy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about your academy. Once approved, you can manage its courses and team in your academy workspace.
        </p>
        <form action={submitAcademyApplicationAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Academy name"><Input name="academyName" required /></Field>
          <Field label="Preferred slug"><Input name="slug" required /></Field>
          <Field label="School">
            <Select name="schoolId" required defaultValue="" disabled={!schoolsAvailable}>
              <option value="" disabled>{schoolsAvailable ? "Select a school" : "Schools unavailable"}</option>
              {schools?.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </Select>
            {!schoolsAvailable && <p role="alert" className="mt-2 text-sm text-muted-foreground">{error ? "We could not load schools. Please refresh the page and try again." : "No schools are available yet. Please try again later."}</p>}
          </Field>
          <Field label="Website"><Input name="website" type="url" /></Field>
          <Field label="Country"><Input name="country" defaultValue="KE" required /></Field>
          <Field label="County"><Input name="county" /></Field>
          <Field label="Short description"><TextArea name="shortDescription" required /></Field>
          <Field label="Experience"><TextArea name="experience" /></Field>
          <Field label="Why do you want to teach?"><TextArea name="whyTeach" required /></Field>
          <Field label="Expected audience"><TextArea name="expectedAudience" required /></Field>
          <label className="flex gap-3 text-sm md:col-span-2">
            <input type="checkbox" name="termsAccepted" required />
            <span>I accept the academy owner terms and understand the application will be reviewed.</span>
          </label>
          <Button className="md:col-span-2" type="submit" disabled={!schoolsAvailable}>Submit academy application</Button>
        </form>
      </Card>
    </section>
  );
}
