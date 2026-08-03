import { requestPayoutAction } from "@/features/operations/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, TextArea } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/payments/money";

export default async function InstructorPayoutsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("payout_requests").select("id,amount_minor,currency,destination_label,status,created_at").eq("requester_id", user.id).order("created_at", { ascending: false }).limit(50);

  return (
    <DashboardShell>
      <PageHeading title="Payout requests" description="Request payouts from eligible earnings. Finance review, payment references, and audit events are implemented; payout automation is deferred." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Requests" description="Your submitted payout requests and finance statuses." headers={["Amount", "Destination", "Status", "Created"]} rows={(data ?? []).map((item) => [formatMoney(item.amount_minor, item.currency), item.destination_label, <Badge key={item.status}>{item.status}</Badge>, new Date(item.created_at).toLocaleDateString("en-KE")])} empty="No payout requests yet." />
        <Card>
          <h2 className="font-semibold">Request payout</h2>
          <form action={requestPayoutAction} className="mt-4 grid gap-4">
            <Field label="Amount minor" hint="KES 1,000 = 100000"><Input name="amountMinor" type="number" min="1" required /></Field>
            <Field label="Currency"><Input name="currency" defaultValue="KES" required /></Field>
            <Field label="Destination"><Input name="destinationLabel" placeholder="M-Pesa, bank, or manual destination label" required /></Field>
            <Field label="Method"><Input name="method" defaultValue="manual" required /></Field>
            <Field label="Notes"><TextArea name="notes" /></Field>
            <Button type="submit">Submit payout request</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
