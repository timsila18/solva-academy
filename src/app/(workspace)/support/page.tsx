import { DataTable } from "@/components/dashboard/data-table";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, Select, TextArea, Input } from "@/components/ui/form-fields";
import { createSupportTicketAction } from "@/features/platform-ops/actions";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getSupportDashboard } from "@/lib/platform-ops/queries";
import Link from "next/link";

export default async function SupportCenterPage() {
  const user = await requireUserOrRedirect();
  const data = await getSupportDashboard(user.id);
  return (
    <DashboardShell>
      <PageHeading
        title="How can we help?"
        description="Ask about your account, a payment, or a class. Track replies here."
      />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create ticket</CardTitle>
            <CardDescription>
              Use support for account, billing, learning, live, academy,
              enterprise, or safety issues.
            </CardDescription>
          </CardHeader>
          <form action={createSupportTicketAction} className="grid gap-4">
            <Field label="Category">
              <Select name="category">
                <option value="learning">Course or class</option>
                <option value="payment">Payment or refund</option>
                <option value="account">Account access</option>
                <option value="academy">Academy setup</option>
                <option value="safety">Report a concern</option>
                <option value="general">Something else</option>
              </Select>
            </Field>
            <Field label="Priority">
              <Select name="priority">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </Field>
            <Field label="Subject">
              <Input name="subject" required />
            </Field>
            <Field label="Description">
              <TextArea name="description" required />
            </Field>
            <Button type="submit">Create ticket</Button>
          </form>
        </Card>
        <DataTable
          title="My tickets"
          description="Open a ticket to read or add a reply."
          headers={["Ticket", "Subject", "Status", "Priority"]}
          rows={data.tickets.map((ticket) => [
            <Link
              key={ticket.id}
              href={`/support/${ticket.id}`}
              className="text-primary underline"
            >
              {ticket.ticket_number}
            </Link>,
            ticket.subject,
            <Badge key={ticket.status}>{ticket.status}</Badge>,
            <Badge key={ticket.priority}>{ticket.priority}</Badge>,
          ])}
          empty="No support tickets yet."
        />
      </div>
      <div className="mt-6">
        <DataTable
          title="Help articles"
          description="Guidance from the Solva Academy team."
          headers={["Article", "Category", "Visibility"]}
          rows={data.articles.map((article) => [
            article.title,
            article.category,
            <Badge key={article.visibility}>{article.visibility}</Badge>,
          ])}
          empty="No help articles published yet."
        />
      </div>
    </DashboardShell>
  );
}
