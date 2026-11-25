import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resetPasswordAction } from "@/features/auth/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-fields";
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const { code, error } = await searchParams;
  if (code) redirect(`/auth/recovery?code=${encodeURIComponent(code)}`);
  const db = await createServerSupabaseClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <Card>
        <Link href="/" className="text-sm text-primary">
          Solva Academy
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Choose a new password</h1>
        {!user ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Open the latest reset link from your email in the same browser
              where you requested it. If it expired, request a new link.
            </p>
            <Link
              href="/auth/forgot-password"
              className="mt-5 inline-block text-primary underline"
            >
              Request a reset link
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Use at least 8 characters. You will sign in again after saving.
            </p>
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error === "same"
                  ? "Choose a password different from your current one."
                  : error === "validation"
                    ? "Use at least 8 characters and make sure both passwords match."
                    : error === "weak"
                      ? "Choose a stronger password with letters, numbers, and symbols."
                      : "Your password could not be changed. Try again or request a fresh reset link."}
              </p>
            )}
            <form action={resetPasswordAction} className="mt-6 grid gap-4">
              <Field label="New password">
                <Input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </Field>
              <Field label="Confirm new password">
                <Input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </Field>
              <Button type="submit">Save new password</Button>
            </form>
          </>
        )}
      </Card>
    </section>
  );
}
