import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PaymentRefresh } from "@/components/learning/payment-refresh";

export default async function PaymentStatusPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const user = await requireUserOrRedirect();
  const db = createServiceSupabaseClient();
  const { data: order } = await db
    .from("orders")
    .select("status,payment_status")
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .single();
  if (!order) notFound();
  const { data: item } = await db
    .from("order_items")
    .select("course_id,lesson_id")
    .eq("order_id", orderId)
    .limit(1)
    .maybeSingle();
  return (
    <DashboardShell>
      <PageHeading
        title="Payment status"
        description="Your access opens after payment is verified."
      />
      <EmptyState
        title={
          order.payment_status === "paid"
            ? "Payment received"
            : order.payment_status === "failed"
              ? "Payment unsuccessful"
              : "Awaiting payment confirmation"
        }
        description={
          order.payment_status === "paid"
            ? "Your course is ready."
            : "Refresh this page after responding to the M-Pesa prompt."
        }
      />
      {order.payment_status === "paid" && item && (
        <div className="mt-4 flex flex-wrap gap-5">
          <Link
            className="text-primary underline"
            href={`/learn/${item.course_id}${item.lesson_id ? `?lesson=${item.lesson_id}` : ""}`}
          >
            Start learning
          </Link>
          <Link
            className="text-primary underline"
            href={`/learner/orders/${orderId}/receipt`}
          >
            View receipt
          </Link>
        </div>
      )}
      <Link
        href="/learner/orders"
        className="mt-5 inline-block text-sm text-primary underline"
      >
        All purchases
      </Link>
      {["initiated", "pending"].includes(order.payment_status) ? (
        <PaymentRefresh />
      ) : order.payment_status !== "paid" ? (
        <Link
          href={`/checkout/${orderId}`}
          className="mt-4 inline-block text-primary underline"
        >
          Return to checkout
        </Link>
      ) : null}
    </DashboardShell>
  );
}
