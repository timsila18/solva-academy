"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation/auth";
import { getEnv } from "@/lib/config/env";
import { writeAuditEvent } from "@/lib/audit/audit";
import { journeyDestination, safeReturnPath } from "@/lib/auth/journeys";
import { registrationErrorCode } from "@/lib/auth/registration-errors";

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/auth/sign-up?error=validation");

  const supabase = await createServerSupabaseClient();
  const destination = safeReturnPath(
    formData.get("next"),
    journeyDestination(parsed.data.intent),
  );
  const failurePath = (code: string) =>
    `/auth/sign-up?${new URLSearchParams({ error: code, intent: parsed.data.intent, ...(formData.get("next") ? { next: destination } : {}) })}`;
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getEnv().NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        full_name: parsed.data.fullName,
        country: parsed.data.country,
        preferred_language: parsed.data.preferredLanguage,
        age_bracket: parsed.data.ageBracket,
        phone: parsed.data.phone || null,
        onboarding_intent: parsed.data.intent,
      },
    },
  });

  // A repeated submission can arrive just after the first request creates the account.
  // Only recover the session when the submitted credentials actually authenticate.
  if (error && registrationErrorCode(error) === "account") {
    const recovered = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (!recovered.error && recovered.data.session && recovered.data.user) {
      await writeAuditEvent({
        actorId: recovered.data.user.id,
        action: "user_signed_in",
        resourceType: "user",
        resourceId: recovered.data.user.id,
        success: true,
        reason: "registration_retry_authenticated",
      });
      redirect(destination);
    }
  }

  await writeAuditEvent({
    actorId: data.user?.id,
    action: "user_registered",
    resourceType: "user",
    resourceId: data.user?.id,
    success: !error,
    reason: error ? `registration_${registrationErrorCode(error)}` : undefined,
  });

  if (error) redirect(failurePath(registrationErrorCode(error)));
  if (data.session) redirect(destination);
  redirect("/auth/check-email");
}

export async function signInAction(formData: FormData) {
  const destination = safeReturnPath(formData.get("next"), "/welcome");
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    redirect(
      `/auth/sign-in?error=validation&next=${encodeURIComponent(destination)}`,
    );

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  await writeAuditEvent({
    actorId: data.user?.id,
    action: "user_signed_in",
    resourceType: "user",
    resourceId: data.user?.id,
    success: !error,
  });

  if (error)
    redirect(
      `/auth/sign-in?error=auth&next=${encodeURIComponent(destination)}`,
    );
  redirect(destination);
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/auth/forgot-password?error=validation");

  const supabase = await createServerSupabaseClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getEnv().NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  redirect("/auth/check-email");
}
