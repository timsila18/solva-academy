import Link from "next/link";
import { signInAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";
import { safeReturnPath } from "@/lib/auth/journeys";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams;
  const destination = safeReturnPath(next);
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <Card>
        <Link href="/" className="text-sm text-primary">Solva Academy</Link>
        <h1 className="mt-4 text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue.</p>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">Unable to sign in. Check your email and password and try again.</p>}
        <form action={signInAction} className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={destination} />
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
          <Link href={next ? `/auth/sign-up?next=${encodeURIComponent(destination)}` : "/auth/sign-up"}>Create account</Link>
        </div>
      </Card>
    </section>
  );
}
