import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { recordHealthCheckAction } from "@/features/platform-ops/actions";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { summarizeHealth } from "@/lib/operations/monitoring";
import { getMonitoringDashboard } from "@/lib/platform-ops/queries";

export default async function AdminMonitoringPage() {
  await requirePlatformAdmin();
  const data = await getMonitoringDashboard();
  const overall = summarizeHealth(data.health.map((check) => ({ service: check.service, status: check.status, latencyMs: check.latency_ms ?? undefined })));
  return (
    <DashboardShell>
      <PageHeading title="Monitoring" description="Monitor API latency, AI latency, live health, queue health, storage, search indexing, jobs, payment callbacks, webhooks, errors, backups, and service status." />
      <MetricsGrid metrics={[
        { label: "Overall status", value: overall, definition: "Computed from recent health checks." },
        { label: "Health checks", value: data.health.length, definition: "Recent system health records." },
        { label: "Monitoring events", value: data.monitoring.length, definition: "Operational metric and alert records." },
        { label: "Backup jobs", value: data.backups.length, definition: "Backup and restore-test job records." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Record health check</CardTitle><CardDescription>Local health recording is available until a monitoring provider is connected.</CardDescription></CardHeader>
          <form action={recordHealthCheckAction} className="grid gap-4">
            <Field label="Service"><Input name="service" defaultValue="web" /></Field>
            <Field label="Check name"><Input name="checkName" defaultValue="manual_check" /></Field>
            <Field label="Status"><Select name="status"><option value="healthy">Healthy</option><option value="degraded">Degraded</option><option value="down">Down</option><option value="unknown">Unknown</option></Select></Field>
            <Field label="Latency ms"><Input name="latencyMs" type="number" min="0" /></Field>
            <Button type="submit">Record check</Button>
          </form>
        </Card>
        <DataTable title="System health" description="Health endpoints and checks are retained for operations review." headers={["Service", "Check", "Status", "Latency"]} rows={data.health.map((check) => [check.service, check.check_name, <Badge key={check.status}>{check.status}</Badge>, check.latency_ms ?? "n/a"])} empty="No health checks yet." />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DataTable title="Monitoring events" description="Alerts remain local until an external provider is configured." headers={["Service", "Metric", "Severity", "Status"]} rows={data.monitoring.map((event) => [event.service, event.metric_name, <Badge key={event.severity}>{event.severity}</Badge>, <Badge key={event.status}>{event.status}</Badge>])} empty="No monitoring events." />
        <DataTable title="Backups and restore tests" description="Supabase backup/PITR configuration is documented; restore drills are tracked here." headers={["Job", "Provider", "Status", "Restore tested"]} rows={data.backups.map((job) => [job.job_type, job.provider, <Badge key={job.status}>{job.status}</Badge>, job.restore_tested ? "Yes" : "No"])} empty="No backup jobs recorded." />
        <DataTable title="Retention policies" description="Platform legal minimums override weaker workspace settings." headers={["Resource", "Days", "Override allowed", "Status"]} rows={data.retention.map((policy) => [policy.resource_type, policy.minimum_retention_days, policy.workspace_override_allowed ? "Yes" : "No", <Badge key={policy.status}>{policy.status}</Badge>])} empty="No retention policies." />
      </div>
    </DashboardShell>
  );
}
