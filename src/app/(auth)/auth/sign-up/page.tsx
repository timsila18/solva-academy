import { signUpAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";

export default function SignUpPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Create your Solva Academy account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This creates one personal account and a learner workspace. Instructor, academy, parent, and employer capabilities can be added later.
        </p>
        <form action={signUpAction} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input name="fullName" autoComplete="name" required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" autoComplete="new-password" required />
          </Field>
          <Field label="Confirm password">
            <Input name="confirmPassword" type="password" autoComplete="new-password" required />
          </Field>
          <Field label="Country">
            <Select name="country" defaultValue="KE" required>
              <option value="KE">Kenya</option>
              <option value="UG">Uganda</option>
              <option value="TZ">Tanzania</option>
              <option value="RW">Rwanda</option>
              <option value="OTHER">Other</option>
            </Select>
          </Field>
          <Field label="Preferred language">
            <Select name="preferredLanguage" defaultValue="en" required>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </Select>
          </Field>
          <Field label="Age bracket">
            <Select name="ageBracket" required>
              <option value="">Select</option>
              <option value="adult">Adult</option>
              <option value="teen">Teen learner</option>
              <option value="child-with-guardian">Child with guardian</option>
            </Select>
          </Field>
          <Field label="Phone number" hint="Optional">
            <Input name="phone" type="tel" autoComplete="tel" />
          </Field>
          <label className="flex gap-3 text-sm sm:col-span-2">
            <input name="termsAccepted" type="checkbox" required />
            <span>I accept the Solva Academy terms.</span>
          </label>
          <label className="flex gap-3 text-sm sm:col-span-2">
            <input name="privacyAcknowledged" type="checkbox" required />
            <span>I acknowledge the privacy notice.</span>
          </label>
          <Button type="submit" className="sm:col-span-2">Create account</Button>
        </form>
      </Card>
    </section>
  );
}
