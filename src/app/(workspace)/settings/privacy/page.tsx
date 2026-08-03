import { DataTable } from "@/components/dashboard/data-table";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Select, TextArea, Input } from "@/components/ui/form-fields";
import { createComplianceRequestAction } from "@/features/platform-ops/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getComplianceDashboard } from "@/lib/platform-ops/queries";

export default async function PrivacySettingsPage() {
  const user = await requireUserOrRedirect();
  const data = await getComplianceDashboard(user.id);
  return (
    <DashboardShell>
      <PageHeading title="Privacy and compliance" description="Create privacy requests for export, deletion, correction, consent review, or Kenya/Data Protection Act readiness workflows." />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Create privacy request</CardTitle><CardDescription>Identity verification may be required before completion.</CardDescription></CardHeader>
          <form action={createComplianceRequestAction} className="grid gap-4">
            <Field label="Request type"><Select name="requestType"><option value="data_export">Data export</option><option value="data_deletion">Data deletion</option><option value="privacy_question">Privacy question</option><option value="consent_review">Consent review</option><option value="correction">Correction</option><option value="objection">Objection</option></Select></Field>
            <Field label="Jurisdiction"><Input name="jurisdiction" defaultValue="KE" /></Field>
            <Field label="Description"><TextArea name="description" required /></Field>
            <Button type="submit">Submit request</Button>
          </form>
        </Card>
        <DataTable title="My privacy requests" description="Requests are tracked with due dates and status." headers={["Type", "Status", "Jurisdiction", "Created"]} rows={data.requests.map((request) => [request.request_type, <Badge key={request.status}>{request.status}</Badge>, request.jurisdiction, new Date(request.created_at).toLocaleDateString("en-KE")])} empty="No privacy requests yet." />
      </div>
      <div className="mt-6">
        <DataTable title="Consent records" description="Consent records are versioned for audit." headers={["Consent", "Version", "Granted", "Recorded"]} rows={data.consents.map((consent) => [consent.consent_type, consent.version, consent.granted ? "Yes" : "No", new Date(consent.recorded_at).toLocaleDateString("en-KE")])} empty="No consent records visible." />
      </div>
    </DashboardShell>
  );
}
