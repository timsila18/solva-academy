import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PaymentStatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const user = await requireUserOrRedirect();
  const db = createServiceSupabaseClient();
  const { data: order } = await db.from("orders").select("status,payment_status").eq("id", orderId).eq("customer_id", user.id).single();
  if (!order) notFound();
  const { data: item } = await db.from("order_items").select("course_id,lesson_id").eq("order_id", orderId).limit(1).maybeSingle();
  return (
    <DashboardShell>
      <PageHeading title="Payment status" description="Check your phone for the M-Pesa prompt. Payment is confirmed only after the secure provider callback is processed." />
      <EmptyState title={order.payment_status === "paid" ? "Payment received" : order.payment_status === "failed" ? "Payment unsuccessful" : "Awaiting payment confirmation"} description={order.payment_status === "paid" ? "Your course is ready." : "Refresh this page after responding to the M-Pesa prompt."} />
      {order.payment_status === "paid" && item && <Link className="mt-4 inline-block text-primary underline" href={`/learn/${item.course_id}${item.lesson_id ? `?lesson=${item.lesson_id}` : ""}`}>Start learning</Link>}
      {order.payment_status !== "paid" && <form method="get" className="mt-4"><button type="submit" className="text-primary underline">Refresh payment status</button></form>}
    </DashboardShell>
  );
}
