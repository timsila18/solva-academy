import Link from "next/link";
import { signInAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use email and password. Social sign-in is not enabled yet.</p>
        <form action={signInAction} className="mt-6 grid gap-4">
          <Field label="Email">
            <Input name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" autoComplete="current-password" required />
          </Field>
          <Button type="submit">Sign in</Button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link href="/auth/forgot-password">Forgot password?</Link>
          <Link href="/auth/sign-up">Create account</Link>
        </div>
      </Card>
    </section>
  );
}
