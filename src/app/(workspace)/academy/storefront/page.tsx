import { saveStorefrontSettingsAction } from "@/features/operations/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyStorefrontPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academy } = await supabase.from("academies").select("id,name,slug").eq("owner_id", user.id).limit(1).maybeSingle();
  return (
    <DashboardShell>
      <PageHeading title="Academy storefront" description="Manage public storefront description, featured content placeholders, SEO, contacts, and display preferences while keeping platform branding isolated." />
      <div className="mb-5">{academy ? <ButtonLink href={`/academies/${academy.slug}`} variant="outline">View public storefront</ButtonLink> : null}</div>
      <Card>
        <form action={saveStorefrontSettingsAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Academy ID"><Input name="academyId" defaultValue={academy?.id} required /></Field>
          <Field label="Public visibility"><Select name="publicVisibility" defaultValue="public"><option value="public">Public</option><option value="unlisted">Unlisted</option><option value="private">Private</option></Select></Field>
          <Field label="Headline"><Input name="headline" placeholder={academy?.name ?? "Academy headline"} /></Field>
          <Field label="Description"><TextArea name="description" /></Field>
          <Field label="Show instructors"><Select name="showInstructors" defaultValue="true"><option value="true">Yes</option><option value="false">No</option></Select></Field>
          <Field label="Show certificates"><Select name="showCertificates" defaultValue="true"><option value="true">Yes</option><option value="false">No</option></Select></Field>
          <Button type="submit" className="md:col-span-2" disabled={!academy}>Save storefront</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
