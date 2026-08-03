import { initiatePaymentAction } from "@/features/commerce/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";

export default async function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <DashboardShell>
      <PageHeading title="Checkout" description="Review the server-calculated order total, enter an M-Pesa phone number, and initiate STK Push securely." />
      <Card>
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <p>Order: <span className="font-mono text-foreground">{orderId}</span></p>
          <p>Currency: KES</p>
          <p>Discounts and tax are calculated server-side.</p>
          <p>Access terms and refund policy are preserved on the order item snapshot.</p>
        </div>
        <form action={initiatePaymentAction} className="mt-6 grid gap-4">
          <input type="hidden" name="orderId" value={orderId} />
          <Field label="M-Pesa phone number" hint="Supported: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX">
            <Input name="phone" inputMode="tel" required />
          </Field>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" name="termsAccepted" required />
            <span>I confirm the amount shown by M-Pesa before entering my PIN.</span>
          </label>
          <Button type="submit">Initiate M-Pesa STK Push</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
