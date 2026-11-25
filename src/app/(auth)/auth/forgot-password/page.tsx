import { forgotPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We will email a secure reset link. Open it in this same browser.
        </p>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error === "rate-limit"
              ? "Too many requests. Please wait a few minutes before trying again."
              : error === "expired"
                ? "That link is invalid or has expired. Request a new one below."
                : error === "validation"
                  ? "Enter a valid email address."
                  : "The reset email could not be sent. Please try again shortly or contact support."}
          </p>
        )}
        <form action={forgotPasswordAction} className="mt-6 grid gap-4">
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Button type="submit">Send reset link</Button>
        </form>
      </Card>
    </section>
  );
}
