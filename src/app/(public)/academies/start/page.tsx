import { submitAcademyApplicationAction } from "@/features/tenants/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

export default function StartAcademyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card>
        <h1 className="text-2xl font-semibold">Start your academy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit a real academy application. Approval creates the academy workspace; course creation is deferred.
        </p>
        <form action={submitAcademyApplicationAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Academy name"><Input name="academyName" required /></Field>
          <Field label="Preferred slug"><Input name="slug" required /></Field>
          <Field label="School"><Select name="schoolId"><option value="">Select after Supabase setup</option></Select></Field>
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
          <Button className="md:col-span-2" type="submit">Submit academy application</Button>
        </form>
      </Card>
    </section>
  );
}
