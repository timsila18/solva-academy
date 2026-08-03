import { DataTable } from "@/components/dashboard/data-table";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Select, TextArea, Input } from "@/components/ui/form-fields";
import { createSupportTicketAction } from "@/features/platform-ops/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getSupportDashboard } from "@/lib/platform-ops/queries";

export default async function SupportCenterPage() {
  const user = await requireUserOrRedirect();
  const data = await getSupportDashboard(user.id);
  return (
    <DashboardShell>
      <PageHeading title="Support center" description="Create support tickets, track replies, review knowledge-base guidance, and keep every support action auditable." />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Create ticket</CardTitle><CardDescription>Use support for account, billing, learning, live, academy, enterprise, or safety issues.</CardDescription></CardHeader>
          <form action={createSupportTicketAction} className="grid gap-4">
            <Field label="Category"><Input name="category" defaultValue="general" /></Field>
            <Field label="Priority"><Select name="priority"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></Select></Field>
            <Field label="Subject"><Input name="subject" required /></Field>
            <Field label="Description"><TextArea name="description" required /></Field>
            <Button type="submit">Create ticket</Button>
          </form>
        </Card>
        <DataTable title="My tickets" description="Internal notes are hidden from customers by RLS." headers={["Ticket", "Subject", "Status", "Priority"]} rows={data.tickets.map((ticket) => [ticket.ticket_number, ticket.subject, <Badge key={ticket.status}>{ticket.status}</Badge>, <Badge key={ticket.priority}>{ticket.priority}</Badge>])} empty="No support tickets yet." />
      </div>
      <div className="mt-6">
        <DataTable title="Knowledge base" description="Published articles are searchable and ready for AI-search integration." headers={["Article", "Category", "Visibility"]} rows={data.articles.map((article) => [article.title, article.category, <Badge key={article.visibility}>{article.visibility}</Badge>])} empty="No published knowledge-base articles yet." />
      </div>
    </DashboardShell>
  );
}
