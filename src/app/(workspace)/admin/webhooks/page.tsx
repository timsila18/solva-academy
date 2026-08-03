import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";
import { createWebhookEndpointAction } from "@/features/launch/actions";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { getWebhookDashboard } from "@/lib/launch/queries";

export default async function AdminWebhooksPage({ searchParams }: { searchParams?: Promise<{ secret?: string }> }) {
  await requirePlatformAdmin();
  const params = await searchParams;
  const data = await getWebhookDashboard();
  return (
    <DashboardShell>
      <PageHeading title="Webhooks" description="Configure signed outbound event endpoints with delivery logs, retry policy, idempotent event identifiers, and replay foundation." />
      {params?.secret ? <Card className="mb-6 border-warning bg-[#191204]"><strong>Copy this webhook secret now:</strong><p className="mt-2 break-all font-mono text-sm">{params.secret}</p><p className="mt-2 text-sm text-muted-foreground">It will not be shown again.</p></Card> : null}
      <MetricsGrid metrics={[
        { label: "Endpoints", value: data.endpoints.length, definition: "Configured webhook endpoints." },
        { label: "Active", value: data.endpoints.filter((endpoint) => endpoint.status === "active").length, definition: "Endpoints receiving queued deliveries." },
        { label: "Deliveries", value: data.deliveries.length, definition: "Recent webhook delivery logs." },
        { label: "Failed", value: data.deliveries.filter((delivery) => delivery.status === "failed").length, definition: "Deliveries requiring attention." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Create endpoint</CardTitle><CardDescription>Only minimal payloads should be sent to third-party systems.</CardDescription></CardHeader>
          <form action={createWebhookEndpointAction} className="grid gap-4">
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="URL"><Input name="url" type="url" required /></Field>
            <Field label="Organization ID"><Input name="organizationId" placeholder="uuid" /></Field>
            <Field label="Event types"><Input name="eventTypes" defaultValue="enrollment.created,course.completed,certificate.issued" required /></Field>
            <Button type="submit">Create endpoint</Button>
          </form>
        </Card>
        <DataTable title="Endpoints" description="Endpoint secrets are hashed and delivery signing uses HMAC SHA-256." headers={["Name", "URL", "Events", "Status"]} rows={data.endpoints.map((endpoint) => [endpoint.name, endpoint.url, endpoint.event_types.join(", "), <Badge key={endpoint.status}>{endpoint.status}</Badge>])} empty="No webhook endpoints." />
      </div>
      <div className="mt-6">
        <DataTable title="Deliveries" description="Retries and provider dispatch workers are deferred to production queue setup." headers={["Event", "ID", "Status", "Attempts"]} rows={data.deliveries.map((delivery) => [delivery.event_type, delivery.event_id, <Badge key={delivery.status}>{delivery.status}</Badge>, delivery.attempt_count])} empty="No webhook deliveries." />
      </div>
    </DashboardShell>
  );
}
