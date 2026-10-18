import { signUpAction } from "@/features/auth/actions";
import { RegistrationSubmit } from "@/components/auth/registration-submit";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import Link from "next/link";
import { accountJourneys, safeReturnPath } from "@/lib/auth/journeys";
import { registrationErrorMessage } from "@/lib/auth/registration-errors";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; intent?: string }>;
}) {
  const { error, next, intent } = await searchParams;
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <Link href="/" className="text-sm text-primary">
          Solva Academy
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose where to start. You can learn, teach, and manage an academy
          with the same account.
        </p>
        {error && (
          <div role="alert" className="mt-4 text-sm text-red-700">
            <p>{registrationErrorMessage(error)}</p>
            <div className="mt-2 flex gap-4">
              <Link
                href={`/auth/sign-in${next ? `?next=${encodeURIComponent(safeReturnPath(next))}` : ""}`}
                className="underline"
              >
                Sign in
              </Link>
              <Link href="/auth/forgot-password" className="underline">
                Reset password
              </Link>
            </div>
          </div>
        )}
        <form action={signUpAction} className="mt-6 grid gap-4 sm:grid-cols-2">
          {next && (
            <input type="hidden" name="next" value={safeReturnPath(next)} />
          )}
          <fieldset className="grid gap-2 border-b border-border pb-5 sm:col-span-2 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-semibold">
              I am joining as a...
            </legend>
            {accountJourneys.map((journey) => (
              <label
                key={journey.id}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="intent"
                  value={journey.id}
                  defaultChecked={journey.id === (intent ?? "learner")}
                  className="mt-1 accent-primary"
                  required
                />
                <span>
                  <span className="block text-sm font-medium">
                    {journey.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {journey.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
          <Field label="Full name">
            <Input name="fullName" autoComplete="name" required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password">
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </Field>
          <Field label="Confirm password">
            <Input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
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
          <RegistrationSubmit />
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/auth/sign-in${next ? `?next=${encodeURIComponent(safeReturnPath(next))}` : ""}`}
            className="text-primary underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </section>
  );
}
