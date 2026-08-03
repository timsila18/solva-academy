import { requestRefundAction } from "@/features/commerce/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, TextArea } from "@/components/ui/form-fields";

export default function RefundRequestPage() {
  return (
    <DashboardShell>
      <PageHeading title="Refund requests" description="Refund requests preserve enrollment history and require controlled finance review." />
      <Card>
        <form action={requestRefundAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Order ID"><Input name="orderId" required /></Field>
          <Field label="Payment attempt ID"><Input name="paymentAttemptId" /></Field>
          <Field label="Course ID"><Input name="courseId" /></Field>
          <Field label="Requested amount minor"><Input name="requestedAmountMinor" type="number" /></Field>
          <Field label="Reason"><Input name="reason" required /></Field>
          <Field label="Preferred resolution"><Input name="requestedResolution" /></Field>
          <Field label="Explanation"><TextArea name="explanation" required /></Field>
          <Button className="md:col-span-2" type="submit">Submit refund request</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
