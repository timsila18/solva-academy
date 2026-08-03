import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { saveProfileSettingsAction } from "@/features/settings/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProfileSettingsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (
    <DashboardShell>
      <PageHeading title="Profile settings" description="Manage public profile fields separately from authentication identity and sensitive account data." />
      <Card>
        <form action={saveProfileSettingsAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Full name"><Input name="fullName" defaultValue={profile?.full_name ?? ""} required /></Field>
          <Field label="Display name"><Input name="displayName" defaultValue={profile?.display_name ?? ""} /></Field>
          <Field label="Headline"><Input name="headline" defaultValue={profile?.headline ?? ""} /></Field>
          <Field label="Country"><Input name="country" defaultValue={profile?.country ?? "KE"} required /></Field>
          <Field label="County"><Input name="county" defaultValue={profile?.county ?? ""} /></Field>
          <Field label="Preferred language"><Select name="preferredLanguage" defaultValue={profile?.preferred_language ?? "en"}><option value="en">English</option><option value="sw">Kiswahili</option></Select></Field>
          <Field label="Biography"><TextArea name="biography" defaultValue={profile?.biography ?? ""} /></Field>
          <Field label="Public profile visibility"><Select name="visibility" defaultValue={profile?.public_profile_visibility ?? "limited"}><option value="private">Private</option><option value="limited">Limited</option><option value="public">Public</option></Select></Field>
          <Button className="md:col-span-2" type="submit">Save profile</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
