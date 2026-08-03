import { forgotPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Reset password</h1>
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
