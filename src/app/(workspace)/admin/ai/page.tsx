import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createAiIndexAction } from "@/features/ai/actions";
import { getAdminAiStats } from "@/lib/ai/queries";
import { requirePlatformAdmin } from "@/lib/authorization/server";

export default async function AdminAiPage() {
  await requirePlatformAdmin();
  const stats = await getAdminAiStats();
  const completed = stats.requests.filter((request) => request.status === "completed").length;
  const blocked = stats.requests.filter((request) => request.status === "blocked").length;
  const highRisk = stats.moderation.filter((event) => ["high", "critical"].includes(event.risk_level)).length;

  return (
    <DashboardShell>
      <PageHeading title="AI governance" description="Manage Solco Intelligence models, capabilities, prompt templates, knowledge indexes, moderation events, usage, cost estimates, and audit history." />
      <MetricsGrid metrics={[
        { label: "Models", value: stats.models.length, definition: "Configured model providers, including future provider placeholders." },
        { label: "Capabilities", value: stats.capabilities.length, definition: "Enabled and disabled AI product capabilities." },
        { label: "Completed", value: completed, definition: "Recent AI requests completed successfully." },
        { label: "Blocked", value: blocked + highRisk, definition: "Blocked or high-risk moderation events visible to platform admins." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create knowledge index</CardTitle>
            <CardDescription>Indexes are searchable only according to their tenant and visibility scope.</CardDescription>
          </CardHeader>
          <form action={createAiIndexAction} className="grid gap-4">
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="Source type">
              <Select name="sourceType">
                <option value="manual">Manual</option>
                <option value="course">Course</option>
                <option value="lesson">Lesson</option>
                <option value="academy">Academy</option>
                <option value="organization">Organization</option>
                <option value="enterprise">Enterprise</option>
                <option value="public_page">Public page</option>
              </Select>
            </Field>
            <Field label="Visibility">
              <Select name="visibility">
                <option value="private">Private</option>
                <option value="workspace">Workspace</option>
                <option value="academy">Academy</option>
                <option value="organization">Organization</option>
                <option value="public">Public</option>
              </Select>
            </Field>
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Body"><TextArea name="body" required /></Field>
            <Button type="submit">Create index</Button>
          </form>
        </Card>
        <div className="grid gap-5">
          <DataTable title="Models" description="Provider routing is centralized and administrator-configurable." headers={["Provider", "Model", "Status"]} rows={stats.models.map((model) => [model.provider, model.display_name, <Badge key={model.status}>{model.status}</Badge>])} empty="No AI models configured." />
          <DataTable title="Capabilities" description="Capabilities can be disabled without removing product code." headers={["Capability", "Risk", "Enabled"]} rows={stats.capabilities.map((capability) => [capability.slug, <Badge key={capability.risk_level}>{capability.risk_level}</Badge>, capability.enabled ? "Yes" : "No"])} empty="No AI capabilities configured." />
        </div>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DataTable title="Recent requests" description="Safety and completion state are visible for audit." headers={["Type", "Status", "Safety", "Created"]} rows={stats.requests.map((request) => [request.request_type, <Badge key={request.status}>{request.status}</Badge>, <Badge key={request.safety_status}>{request.safety_status}</Badge>, new Date(request.created_at).toLocaleString("en-KE")])} empty="No AI requests yet." />
        <DataTable title="Moderation events" description="Prompt and response checks are retained." headers={["Event", "Decision", "Risk", "Created"]} rows={stats.moderation.map((event) => [event.event_type, <Badge key={event.decision}>{event.decision}</Badge>, <Badge key={event.risk_level}>{event.risk_level}</Badge>, new Date(event.created_at).toLocaleString("en-KE")])} empty="No moderation events yet." />
        <DataTable title="Knowledge indexes" description="No private tenant index is public unless explicitly configured." headers={["Title", "Visibility", "Status"]} rows={stats.indexes.map((index) => [index.title, <Badge key={index.visibility}>{index.visibility}</Badge>, <Badge key={index.status}>{index.status}</Badge>])} empty="No AI indexes yet." />
      </div>
    </DashboardShell>
  );
}
