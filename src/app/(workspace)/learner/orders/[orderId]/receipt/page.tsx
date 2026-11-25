import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PrintRecord } from "@/components/learning/print-record";
export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const user = await requireUserOrRedirect();
  const { orderId } = await params;
  const db = createServiceSupabaseClient();
  const { data: order } = await db
    .from("orders")
    .select("id,order_number,currency,grand_total_minor,payment_status,paid_at")
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .eq("payment_status", "paid")
    .maybeSingle();
  if (!order) notFound();
  const { data: r } = await db
    .from("receipts")
    .select("receipt_number,issued_at")
    .eq("order_id", order.id)
    .maybeSingle();
  if (!r) notFound();
  const { data: items } = await db
    .from("order_items")
    .select(
      "id,quantity,total_minor,lesson_id,courses(title),course_lessons(title)",
    )
    .eq("order_id", order.id);
  const money = (value: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: order.currency,
    }).format(value / 100);
  return (
    <DashboardShell>
      <section className="mx-auto max-w-3xl">
        <div className="flex flex-wrap justify-between gap-4 print:hidden">
          <Link href="/learner/orders" className="text-primary underline">
            Purchase history
          </Link>
          <PrintRecord />
        </div>
        <div className="mt-8 border-y border-border py-6">
          <p className="font-semibold text-primary">Solva Academy</p>
          <h1 className="mt-4 text-2xl font-semibold">Payment receipt</h1>
          <p className="mt-3 break-all text-sm">{r.receipt_number}</p>
          <p className="mt-2 text-sm">
            Issued {new Date(r.issued_at).toLocaleDateString("en-KE")}
          </p>
          <p className="mt-2 break-all text-sm">Order {order.order_number}</p>
        </div>
        <div className="divide-y divide-border">
          {items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 py-4 text-sm"
            >
              <span>
                {(item.course_lessons as unknown as { title: string } | null)
                  ?.title ??
                  (item.courses as unknown as { title: string } | null)
                    ?.title ??
                  "Learning purchase"}{" "}
                · Qty {item.quantity}
              </span>
              <span>{money(item.total_minor)}</span>
            </div>
          ))}
        </div>
        <p className="border-t border-border pt-4 text-right font-semibold">
          Paid: {money(order.grand_total_minor)}
        </p>
        <p className="mt-8 text-xs text-muted-foreground">
          Confirmation of payment received. This is not represented as a tax
          invoice.
        </p>
        <Link
          href="/support"
          className="mt-5 inline-block text-sm text-primary underline print:hidden"
        >
          Payment support
        </Link>
      </section>
    </DashboardShell>
  );
}
