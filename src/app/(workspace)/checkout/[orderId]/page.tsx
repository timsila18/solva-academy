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
import Link from "next/link";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { orderId } = await params;
  const user = await requireUserOrRedirect();
  const { error } = await searchParams;
  const db = createServiceSupabaseClient();
  const { data: order } = await db
    .from("orders")
    .select("order_number,grand_total_minor,currency")
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .single();
  if (!order) notFound();
  const { data: items } = await db
    .from("order_items")
    .select(
      "id,access_duration_days,refund_policy_snapshot,courses(title),course_lessons(title)",
    )
    .eq("order_id", orderId);
  const available = isMpesaConfigured();
  const hostedAvailable = isPaystackConfigured();
  return (
    <DashboardShell>
      <PageHeading
        title="Checkout"
        description="Review your order and choose a payment method."
      />
      <Card>
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <p>
            Order:{" "}
            <span className="font-mono text-foreground">
              {order.order_number}
            </span>
          </p>
          <p className="font-semibold text-foreground">
            Total:{" "}
            {new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: order.currency,
            }).format(order.grand_total_minor / 100)}
          </p>
        </div>
        <section className="mt-5 divide-y divide-border border-y border-border">
          {items?.map((item) => (
            <div key={item.id} className="py-4 text-sm">
              <h2 className="font-medium">
                {(item.course_lessons as unknown as { title: string } | null)
                  ?.title ??
                  (item.courses as unknown as { title: string } | null)
                    ?.title ??
                  "Learning purchase"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Access:{" "}
                {item.access_duration_days
                  ? `${item.access_duration_days} days from purchase`
                  : "No scheduled expiry"}
              </p>
              <p className="mt-2 text-muted-foreground">
                Refund terms:{" "}
                {item.refund_policy_snapshot ||
                  "Review the platform refund policy or ask support before paying."}
              </p>
              <Link
                href="/refund-policy"
                className="mt-2 inline-block text-primary underline"
              >
                Refund policy
              </Link>
            </div>
          ))}
        </section>
        {!available && !hostedAvailable && (
          <p role="status" className="mt-4 text-sm">
            Online payments are not available yet. Please contact support before
            purchasing.
          </p>
        )}
        {hostedAvailable && (
          <form action={payWithPaystackAction} className="mt-6">
            <input type="hidden" name="orderId" value={orderId} />
            <Button type="submit">Pay by card or M-Pesa</Button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            Payment could not be started. You have not been granted paid access.
            Please try again or contact support.
          </p>
        )}
        {available && (
          <form action={initiatePaymentAction} className="mt-6 grid gap-4">
            <input type="hidden" name="orderId" value={orderId} />
            <Field
              label="M-Pesa phone number"
              hint="Supported: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX"
            >
              <Input name="phone" inputMode="tel" required />
            </Field>
            <label className="flex gap-3 text-sm">
              <input type="checkbox" name="termsAccepted" required />
              <span>
                I confirm the amount shown by M-Pesa before entering my PIN.
              </span>
            </label>
            <Button type="submit" disabled={!available}>
              Pay with M-Pesa
            </Button>
          </form>
        )}
        <Link
          href="/support"
          className="mt-5 inline-block text-sm text-primary underline"
        >
          Get payment help
        </Link>
      </Card>
    </DashboardShell>
  );
}
