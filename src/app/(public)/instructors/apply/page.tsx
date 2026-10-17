import { submitInstructorApplicationAction } from "@/features/tenants/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function InstructorApplyPage() {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  const { data: schools } = await db.from("schools").select("id,name").eq("visibility", "public").in("status", ["published", "active"]).order("display_order");
  if (!user) return <section className="mx-auto max-w-lg px-4 py-12"><h1 className="text-2xl font-semibold">Teach on Solva Academy</h1><p className="mt-3 text-muted-foreground">Create an account or sign in to apply as an instructor.</p><div className="mt-6 flex gap-5"><Link href="/auth/sign-up?intent=instructor" className="text-primary underline">Create account</Link><Link href="/auth/sign-in?next=%2Finstructors%2Fapply" className="text-primary underline">Sign in</Link></div></section>;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card>
        <h1 className="text-2xl font-semibold">Apply to teach</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what you teach and about your experience. We’ll review your application before you begin teaching.
        </p>
        <form action={submitInstructorApplicationAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Expertise"><Input name="expertise" required /></Field>
          <Field label="Teaching languages"><Input name="languages" placeholder="English, Kiswahili" required /></Field>
          <Field label="School"><Select name="schoolId" required><option value="">Select a school</option>{schools?.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</Select></Field>
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
