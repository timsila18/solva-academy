"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { forgotPasswordSchema, signInSchema, signUpSchema } from "@/lib/validation/auth";
import { getEnv } from "@/lib/config/env";
import { writeAuditEvent } from "@/lib/audit/audit";

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/auth/sign-up?error=validation");

  const supabase = await createServerSupabaseClient();
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
      },
    },
  });

  await writeAuditEvent({
    actorId: data.user?.id,
    action: "user_registered",
    resourceType: "user",
    resourceId: data.user?.id,
    success: !error,
  });

  if (error) redirect("/auth/sign-up?error=auth");
  redirect("/auth/check-email");
}

export async function signInAction(formData: FormData) {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/auth/sign-in?error=validation");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  await writeAuditEvent({
    actorId: data.user?.id,
    action: "user_signed_in",
    resourceType: "user",
    resourceId: data.user?.id,
    success: !error,
  });

  if (error) redirect("/auth/sign-in?error=auth");
  redirect("/learner");
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
