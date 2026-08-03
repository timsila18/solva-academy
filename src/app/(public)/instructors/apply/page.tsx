import { submitInstructorApplicationAction } from "@/features/tenants/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";

export default function InstructorApplyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card>
        <h1 className="text-2xl font-semibold">Apply to teach</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Instructor approval and verification are modular. This does not create fake teaching credentials.
        </p>
        <form action={submitInstructorApplicationAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Expertise"><Input name="expertise" required /></Field>
          <Field label="Teaching languages"><Input name="languages" placeholder="English, Kiswahili" required /></Field>
          <Field label="School"><Select name="schoolId"><option value="">Select after Supabase setup</option></Select></Field>
          <Field label="Child teaching preference">
            <Select name="childTeachingPreference" defaultValue="not_requested">
              <option value="not_requested">Not requested</option>
              <option value="interested">Interested</option>
              <option value="not_interested">Not interested</option>
            </Select>
          </Field>
          <Field label="Biography"><TextArea name="biography" required /></Field>
          <Field label="Experience"><TextArea name="experience" /></Field>
          <Field label="Teaching style"><TextArea name="teachingStyle" /></Field>
          <Field label="Portfolio links"><TextArea name="portfolioLinks" /></Field>
          <Field label="Sample lesson URL"><Input name="sampleLessonUrl" type="url" /></Field>
          <Field label="Availability"><Input name="availability" /></Field>
          <label className="flex gap-3 text-sm md:col-span-2">
            <input type="checkbox" name="identityConfirmation" required />
            <span>I confirm that Solva may request identity and qualification verification before approval.</span>
          </label>
          <Button className="md:col-span-2" type="submit">Submit instructor application</Button>
        </form>
      </Card>
    </section>
  );
}
