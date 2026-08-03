import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { EmptyState } from "@/components/feedback/empty-state";
import { saveAcademyBrandAction } from "@/features/settings/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyBrandPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academy } = await supabase.from("academies").select("id,name").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: branding } = academy ? await supabase.from("academy_branding").select("*").eq("academy_id", academy.id).maybeSingle() : { data: null };
  return (
    <DashboardShell>
      <PageHeading title="Academy branding" description="Academy branding is tenant-specific and never changes the Solva Academy platform brand." />
      {academy ? <Card>
        <form action={saveAcademyBrandAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="academyId" value={academy.id} />
          <Field label="Logo"><Input type="file" accept="image/png,image/jpeg,image/webp" /></Field>
          <Field label="Banner"><Input type="file" accept="image/png,image/jpeg,image/webp" /></Field>
          <Field label="Accent color"><Input name="accentColor" type="color" defaultValue={branding?.accent_color ?? "#006BFF"} /></Field>
          <Field label="Website"><Input name="website" type="url" defaultValue={branding?.website ?? ""} /></Field>
          <Field label="Contact email"><Input name="contactEmail" type="email" defaultValue={branding?.contact_email ?? ""} /></Field>
          <Field label="Phone"><Input name="phone" type="tel" defaultValue={branding?.phone ?? ""} /></Field>
          <Field label="Location"><Input name="location" defaultValue={branding?.location ?? ""} /></Field>
          <Field label="Support email"><Input name="supportEmail" type="email" defaultValue={branding?.support_email ?? ""} /></Field>
          <Field label="Public visibility"><Select name="publicVisibility" defaultValue={branding?.public_visibility ?? "private"}><option value="private">Private</option><option value="public">Public</option><option value="unlisted">Unlisted</option></Select></Field>
          <Field label="Mission"><TextArea name="mission" defaultValue={branding?.mission ?? ""} /></Field>
          <Field label="SEO description"><TextArea name="seoDescription" defaultValue={(branding?.seo as { description?: string } | null)?.description ?? ""} /></Field>
          <Button className="md:col-span-2" type="submit">Save branding</Button>
        </form>
      </Card> : <EmptyState title="No academy workspace yet" description="Create or approve an academy before editing academy branding." />}
    </DashboardShell>
  );
}
