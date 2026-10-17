import { initiatePaymentAction } from "@/features/commerce/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-fields";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { isMpesaConfigured } from "@/lib/payments/mpesa";
import { notFound } from "next/navigation";
import { isPaystackConfigured } from "@/lib/payments/paystack";
import { payWithPaystackAction } from "@/features/commerce/paystack-actions";

export default async function CheckoutPage({ params, searchParams }: { params: Promise<{ orderId: string }>; searchParams: Promise<{ error?: string }> }) {
  const { orderId } = await params;
  const user = await requireUserOrRedirect();
  const { error } = await searchParams;
  const db = createServiceSupabaseClient();
  const { data: order } = await db.from("orders").select("order_number,grand_total_minor,currency").eq("id", orderId).eq("customer_id", user.id).single();
  if (!order) notFound();
  const available = isMpesaConfigured();
  const hostedAvailable = isPaystackConfigured();
  return (
    <DashboardShell>
      <PageHeading title="Checkout" description="Review the server-calculated order total, enter an M-Pesa phone number, and initiate STK Push securely." />
      <Card>
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <p>Order: <span className="font-mono text-foreground">{order.order_number}</span></p>
          <p className="font-semibold text-foreground">Total: {new Intl.NumberFormat("en-KE", { style: "currency", currency: order.currency }).format(order.grand_total_minor / 100)}</p>
        </div>
        {!available && !hostedAvailable && <p role="status" className="mt-4 text-sm">Online payments are not available yet. Please contact support before purchasing.</p>}
        {hostedAvailable && <form action={payWithPaystackAction} className="mt-6"><input type="hidden" name="orderId" value={orderId} /><Button type="submit">Pay by card or M-Pesa</Button></form>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">Payment could not be started. You have not been granted paid access. Please try again or contact support.</p>}
        <form action={initiatePaymentAction} className="mt-6 grid gap-4">
          <input type="hidden" name="orderId" value={orderId} />
          <Field label="M-Pesa phone number" hint="Supported: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX">
            <Input name="phone" inputMode="tel" required />
          </Field>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" name="termsAccepted" required />
            <span>I confirm the amount shown by M-Pesa before entering my PIN.</span>
          </label>
          <Button type="submit" disabled={!available}>Pay with M-Pesa</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
