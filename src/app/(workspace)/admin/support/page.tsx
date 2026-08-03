import { DataTable } from "@/components/dashboard/data-table";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requirePlatformAdmin } from "@/lib/authorization/server";
import { getSupportDashboard } from "@/lib/platform-ops/queries";

export default async function AdminSupportPage() {
  await requirePlatformAdmin();
  const data = await getSupportDashboard();
  return (
    <DashboardShell>
      <PageHeading title="Support operations" description="Monitor tickets, assignments, priorities, SLA placeholders, internal notes, customer replies, and resolution tracking." />
      <MetricsGrid metrics={[
        { label: "Tickets", value: data.tickets.length, definition: "Recent tickets visible to support operations." },
        { label: "Open", value: data.tickets.filter((t) => t.status === "open").length, definition: "Tickets currently open." },
        { label: "Escalated", value: data.tickets.filter((t) => t.status === "escalated").length, definition: "Tickets requiring higher attention." },
        { label: "KB articles", value: data.articles.length, definition: "Knowledge-base articles visible to support." },
      ]} />
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DataTable title="Tickets" description="Support agents see assigned tickets plus governed support queues." headers={["Ticket", "Subject", "Status", "Priority"]} rows={data.tickets.map((ticket) => [ticket.ticket_number, ticket.subject, <Badge key={ticket.status}>{ticket.status}</Badge>, <Badge key={ticket.priority}>{ticket.priority}</Badge>])} empty="No tickets yet." />
        <DataTable title="Knowledge base" description="Articles support FAQs, internal support, and AI-searchable help." headers={["Article", "Category", "Status", "Visibility"]} rows={data.articles.map((article) => [article.title, article.category, <Badge key={article.status}>{article.status}</Badge>, <Badge key={article.visibility}>{article.visibility}</Badge>])} empty="No articles yet." />
      </div>
    </DashboardShell>
  );
}
