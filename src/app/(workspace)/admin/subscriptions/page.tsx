import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-fields";
import { createSubscriptionPlanAction } from "@/features/platform-ops/actions";
import { getBillingDashboard } from "@/lib/platform-ops/queries";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { formatMoney } from "@/lib/payments/money";

export default async function AdminSubscriptionsPage() {
  await requirePlatformAdmin();
  const data = await getBillingDashboard();
  return (
    <DashboardShell>
      <PageHeading title="Subscriptions" description="Manage configurable plans, lifecycle states, trials, limits, AI credits, live capacity, and workspace subscription records." />
      <MetricsGrid metrics={[
        { label: "Plans", value: data.plans.length, definition: "Configurable subscription plans." },
        { label: "Subscriptions", value: data.subscriptions.length, definition: "Recent subscriptions visible to billing admins." },
        { label: "Active", value: data.subscriptions.filter((s) => s.status === "active").length, definition: "Subscriptions currently active." },
        { label: "Past due", value: data.subscriptions.filter((s) => s.status === "past_due").length, definition: "Subscriptions requiring payment follow-up." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Create plan</CardTitle><CardDescription>Plans are database-backed and do not require deployment to change.</CardDescription></CardHeader>
          <form action={createSubscriptionPlanAction} className="grid gap-4">
            <Field label="Name"><Input name="name" required /></Field>
            <Field label="Slug"><Input name="slug" required /></Field>
            <Field label="Audience"><Select name="audience"><option value="individual">Individual</option><option value="instructor">Instructor</option><option value="academy">Academy</option><option value="organization">Organization</option><option value="government">Government</option><option value="university">University</option><option value="custom_enterprise">Custom enterprise</option></Select></Field>
            <Field label="Price minor"><Input name="priceMinor" type="number" min="0" defaultValue="0" /></Field>
            <Field label="Billing interval"><Select name="billingInterval"><option value="free">Free</option><option value="monthly">Monthly</option><option value="annual">Annual</option><option value="custom">Custom</option></Select></Field>
            <Field label="Trial days"><Input name="trialDays" type="number" min="0" defaultValue="0" /></Field>
            <Button type="submit">Save plan</Button>
          </form>
        </Card>
        <DataTable title="Plans" description="Initial plans are seeded but editable through admin workflows." headers={["Plan", "Audience", "Price", "Status"]} rows={data.plans.map((plan) => [plan.name, plan.audience, formatMoney(plan.price_minor), <Badge key={plan.status}>{plan.status}</Badge>])} empty="No plans configured." />
      </div>
      <div className="mt-6">
        <DataTable title="Recent subscriptions" description="Lifecycle changes are audited through billing events." headers={["Customer", "Status", "Price", "Created"]} rows={data.subscriptions.map((sub) => [sub.customer_name, <Badge key={sub.status}>{sub.status}</Badge>, formatMoney(sub.price_minor, sub.currency), new Date(sub.created_at).toLocaleString("en-KE")])} empty="No subscriptions yet." />
      </div>
    </DashboardShell>
  );
}
