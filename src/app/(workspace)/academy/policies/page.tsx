import { saveAcademyPolicyAction } from "@/features/operations/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AcademyPoliciesPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academy } = await supabase.from("academies").select("id,name").eq("owner_id", user.id).limit(1).maybeSingle();
  return (
    <DashboardShell>
      <PageHeading title="Academy policies" description="Configure internal review, branding rules, assessment defaults, refund guidance, communication preferences, conduct, and instructor expectations." />
      <Card>
        <form action={saveAcademyPolicyAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Academy ID"><Input name="academyId" defaultValue={academy?.id} required /></Field>
          <Field label="Visibility"><Select name="visibility" defaultValue="internal"><option value="internal">Internal</option><option value="public">Public</option></Select></Field>
          <Field label="Internal review required"><Select name="internalReviewRequired" defaultValue="true"><option value="true">Yes</option><option value="false">No</option></Select></Field>
          <Field label="Course branding rules"><TextArea name="courseBrandingRules" /></Field>
          <Field label="Assessment rules"><TextArea name="assessmentRules" /></Field>
          <Field label="Refund guidance"><TextArea name="refundGuidance" /></Field>
          <Field label="Communication preferences"><TextArea name="communicationPreferences" /></Field>
          <Field label="Learner conduct"><TextArea name="learnerConduct" /></Field>
          <Field label="Instructor expectations"><TextArea name="instructorExpectations" /></Field>
          <Button type="submit" className="md:col-span-2" disabled={!academy}>Save policies</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
