import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { createApiKeyAction } from "@/features/launch/actions";
import { apiScopes, maskApiKey } from "@/lib/api/keys";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { getApiDashboard } from "@/lib/launch/queries";

export default async function AdminApiPage({ searchParams }: { searchParams?: Promise<{ secret?: string }> }) {
  await requirePlatformAdmin();
  const params = await searchParams;
  const data = await getApiDashboard();
  return (
    <DashboardShell>
      <PageHeading title="Public APIs" description="Manage scoped API keys, usage, pagination, rate limits, idempotency, and versioned API access." />
      {params?.secret ? <Card className="mb-6 border-warning bg-[#191204]"><strong>Copy this API key now:</strong><p className="mt-2 break-all font-mono text-sm">{params.secret}</p><p className="mt-2 text-sm text-muted-foreground">It will not be shown again.</p></Card> : null}
      <MetricsGrid metrics={[
        { label: "API keys", value: data.keys.length, definition: "Keys visible to platform administrators." },
        { label: "Active", value: data.keys.filter((key) => key.status === "active").length, definition: "Keys not revoked or expired." },
        { label: "Usage rows", value: data.usage.length, definition: "Recent API usage records." },
        { label: "Errors", value: data.usage.filter((row) => row.status_code >= 400).length, definition: "Recent non-success API responses." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Create API key</CardTitle><CardDescription>Bind keys to a workspace, academy, or organization before using them outside platform admin tests.</CardDescription></CardHeader>
          <form action={createApiKeyAction} className="grid gap-4">
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="Organization ID"><Input name="organizationId" placeholder="uuid" /></Field>
            <Field label="Academy ID"><Input name="academyId" placeholder="uuid" /></Field>
            <Field label="Scopes"><Input name="scopes" defaultValue={apiScopes.slice(0, 2).join(",")} required /></Field>
            <Field label="Environment"><Select name="environment"><option value="development">Development</option><option value="staging">Staging</option><option value="production">Production</option></Select></Field>
            <Button type="submit">Create key</Button>
          </form>
        </Card>
        <DataTable title="API keys" description="Secrets are stored as hashes and only the prefix is retained." headers={["Name", "Prefix", "Scopes", "Status"]} rows={data.keys.map((key) => [key.name, maskApiKey(key.key_prefix), key.scopes.join(", "), <Badge key={key.status}>{key.status}</Badge>])} empty="No API keys yet." />
      </div>
      <div className="mt-6">
        <DataTable title="Usage" description="Usage logging supports audit, rate-limit tuning, and customer support." headers={["Route", "Method", "Status", "Latency"]} rows={data.usage.map((row) => [row.route, row.method, row.status_code, row.latency_ms ?? "n/a"])} empty="No API usage recorded." />
      </div>
    </DashboardShell>
  );
}
