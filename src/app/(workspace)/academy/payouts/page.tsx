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

export default async function AcademyPayoutsPage() {
  const user = await requireUserOrRedirect();
  const supabase = await createServerSupabaseClient();
  const { data: academies } = await supabase.from("academies").select("id,name,workspace_id").eq("owner_id", user.id);
  const ids = (academies ?? []).map((academy) => academy.id);
  const { data } = ids.length ? await supabase.from("payout_requests").select("id,academy_id,amount_minor,currency,status,created_at").in("academy_id", ids).order("created_at", { ascending: false }).limit(50) : { data: [] };
  const firstAcademy = academies?.[0];
  return (
    <DashboardShell>
      <PageHeading title="Academy payouts" description="Academy payout requests are reviewed by finance and audited; actual payout automation is deferred." />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <DataTable title="Requests" description="Academy-level payout request statuses." headers={["Amount", "Academy", "Status", "Created"]} rows={(data ?? []).map((item) => [formatMoney(item.amount_minor, item.currency), item.academy_id, <Badge key={item.status}>{item.status}</Badge>, new Date(item.created_at).toLocaleDateString("en-KE")])} empty="No academy payout requests yet." />
        <Card>
          <h2 className="font-semibold">Request academy payout</h2>
          <form action={requestPayoutAction} className="mt-4 grid gap-4">
            <Field label="Academy ID"><Input name="academyId" defaultValue={firstAcademy?.id} required /></Field>
            <Field label="Workspace ID"><Input name="workspaceId" defaultValue={firstAcademy?.workspace_id} /></Field>
            <Field label="Amount minor"><Input name="amountMinor" type="number" min="1" required /></Field>
            <Field label="Currency"><Input name="currency" defaultValue="KES" required /></Field>
            <Field label="Destination"><Input name="destinationLabel" placeholder="Manual payout destination" required /></Field>
            <Field label="Notes"><TextArea name="notes" /></Field>
            <Button type="submit" disabled={!firstAcademy}>Submit payout request</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
