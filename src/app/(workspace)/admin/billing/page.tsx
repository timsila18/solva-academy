import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";
import { generateInvoiceAction } from "@/features/platform-ops/actions";
import { getBillingDashboard } from "@/lib/platform-ops/queries";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { formatMoney } from "@/lib/payments/money";

export default async function AdminBillingPage() {
  await requirePlatformAdmin();
  const data = await getBillingDashboard();
  const invoiceTotal = data.invoices.reduce((sum, invoice) => sum + Number(invoice.total_minor ?? 0), 0);
  return (
    <DashboardShell>
      <PageHeading title="Billing" description="Generate invoices, manage payment references, billing events, adjustments, tax placeholders, and PDF-ready invoice snapshots." />
      <MetricsGrid metrics={[
        { label: "Invoices", value: data.invoices.length, definition: "Recent invoices visible to finance admins." },
        { label: "Invoice value", value: formatMoney(invoiceTotal), definition: "Total value of recent invoice records." },
        { label: "Open balance", value: formatMoney(data.invoices.reduce((sum, invoice) => sum + Number(invoice.balance_minor ?? 0), 0)), definition: "Outstanding balances from recent invoices." },
        { label: "Paid", value: data.invoices.filter((i) => i.status === "paid").length, definition: "Invoices marked paid." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Generate invoice</CardTitle><CardDescription>Server-side calculation creates an auditable invoice and line item.</CardDescription></CardHeader>
          <form action={generateInvoiceAction} className="grid gap-4">
            <Field label="Customer name"><Input name="customerName" required /></Field>
            <Field label="Customer email"><Input name="customerEmail" type="email" /></Field>
            <Field label="Line description"><Input name="description" required /></Field>
            <Field label="Unit amount minor"><Input name="unitAmountMinor" type="number" min="0" required /></Field>
            <Field label="Quantity"><Input name="quantity" type="number" min="1" defaultValue="1" /></Field>
            <Field label="Tax rate %"><Input name="taxRate" type="number" min="0" defaultValue="0" /></Field>
            <Button type="submit">Generate invoice</Button>
          </form>
        </Card>
        <DataTable title="Invoices" description="PDF file rendering is prepared through the `pdf_path` field and deferred to provider integration." headers={["Invoice", "Customer", "Status", "Total"]} rows={data.invoices.map((invoice) => [invoice.invoice_number, invoice.customer_name, <Badge key={invoice.status}>{invoice.status}</Badge>, formatMoney(invoice.total_minor, invoice.currency)])} empty="No invoices generated." />
      </div>
    </DashboardShell>
  );
}
