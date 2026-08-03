"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { writeAuditEvent } from "@/lib/audit/audit";
import { requireUser } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const profileSettingsSchema = z.object({
  fullName: z.string().min(2).max(160),
  displayName: z.string().max(160).optional(),
  headline: z.string().max(180).optional(),
  country: z.string().min(2).max(80),
  county: z.string().max(80).optional(),
  preferredLanguage: z.enum(["en", "sw"]).default("en"),
  biography: z.string().max(2000).optional(),
  visibility: z.enum(["private", "limited", "public"]).default("limited"),
});

const academyBrandSchema = z.object({
  academyId: z.string().uuid(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  website: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  location: z.string().max(160).optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  publicVisibility: z.enum(["private", "public", "unlisted"]).default("private"),
  mission: z.string().max(1000).optional(),
  seoDescription: z.string().max(500).optional(),
});

export async function saveProfileSettingsAction(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/settings/profile?error=validation");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("profiles").update({
    full_name: parsed.data.fullName,
    display_name: parsed.data.displayName || parsed.data.fullName,
    headline: parsed.data.headline || null,
    country: parsed.data.country,
    county: parsed.data.county || null,
    preferred_language: parsed.data.preferredLanguage,
    biography: parsed.data.biography || null,
    public_profile_visibility: parsed.data.visibility,
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);

  await writeAuditEvent({ actorId: user.id, action: "profile_settings_saved", resourceType: "profile", resourceId: user.id, success: !error });
  redirect(error ? "/settings/profile?error=save" : "/settings/profile?saved=true");
}

export async function saveAcademyBrandAction(formData: FormData) {
  const user = await requireUser();
  const parsed = academyBrandSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/academy/brand?error=validation");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("academy_branding").upsert({
    academy_id: parsed.data.academyId,
    accent_color: parsed.data.accentColor,
    website: parsed.data.website || null,
    contact_email: parsed.data.contactEmail || null,
    phone: parsed.data.phone || null,
    location: parsed.data.location || null,
    support_email: parsed.data.supportEmail || null,
    public_visibility: parsed.data.publicVisibility,
    mission: parsed.data.mission || null,
    seo: { description: parsed.data.seoDescription || "" },
    updated_at: new Date().toISOString(),
  });

  await writeAuditEvent({ actorId: user.id, action: "academy_brand_saved", resourceType: "academy", resourceId: parsed.data.academyId, success: !error });
  redirect(error ? "/academy/brand?error=save" : "/academy/brand?saved=true");
}
