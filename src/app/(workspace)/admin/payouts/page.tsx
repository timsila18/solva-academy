import { decidePayoutAction } from "@/features/operations/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/payments/money";

export default async function AdminPayoutsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("payout_requests").select("id,requester_id,academy_id,amount_minor,currency,status,destination_label,created_at").order("created_at", { ascending: false }).limit(100);
  return (
    <DashboardShell>
      <PageHeading title="Payout review" description="Finance administrators review, approve, reject, request clarification, and mark payouts paid. Permission: finance.payout.manage." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Payout requests" description="All finance actions write payout events and audit logs." headers={["ID", "Amount", "Destination", "Status", "Requester", "Created"]} rows={(data ?? []).map((item) => [<span key={item.id} className="font-mono text-xs">{item.id}</span>, formatMoney(item.amount_minor, item.currency), item.destination_label, <Badge key={item.status}>{item.status}</Badge>, <span key={item.requester_id} className="font-mono text-xs">{item.requester_id}</span>, new Date(item.created_at).toLocaleDateString("en-KE")])} empty="No payout requests yet." />
        <Card>
          <h2 className="font-semibold">Finance decision</h2>
          <form action={decidePayoutAction} className="mt-4 grid gap-4">
            <Field label="Payout request ID"><Input name="payoutRequestId" required /></Field>
            <Field label="Status"><Select name="status" defaultValue="under_review"><option value="under_review">Under review</option><option value="clarification_requested">Request clarification</option><option value="approved">Approve</option><option value="rejected">Reject</option><option value="paid">Mark paid</option><option value="cancelled">Cancel</option></Select></Field>
            <Field label="Decision reason"><TextArea name="decisionReason" /></Field>
            <Field label="Payment reference"><Input name="paymentReference" /></Field>
            <Button type="submit">Save decision</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
