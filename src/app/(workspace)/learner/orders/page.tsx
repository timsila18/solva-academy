import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/dashboard/page-heading";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function LearnerOrdersPage() {
  const user = await requireUserOrRedirect();
  const db = await createServerSupabaseClient();
  const { data: orders, error } = await db
    .from("orders")
    .select(
      "id,order_number,grand_total_minor,currency,payment_status,created_at,receipts(id,receipt_number)",
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <DashboardShell>
      <PageHeading
        title="Orders and receipts"
        description="Your purchases and payment history."
      />
      {error ? (
        <p role="alert">
          Orders could not load. Please refresh or contact support.
        </p>
      ) : orders?.length ? (
        <div className="divide-y divide-border border-y border-border">
          {orders.map((o) => {
            const receipt = (
              Array.isArray(o.receipts) ? o.receipts[0] : o.receipts
            ) as { receipt_number: string } | undefined;
            return (
              <article
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-4 py-5"
              >
                <div className="min-w-0">
                  <h2 className="break-all text-sm font-medium">
                    {o.order_number}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("en-KE")} ·{" "}
                    {o.payment_status.replaceAll("_", " ")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span>
                    {new Intl.NumberFormat("en-KE", {
                      style: "currency",
                      currency: o.currency,
                    }).format(o.grand_total_minor / 100)}
                  </span>
                  <Link
                    href={`/checkout/${o.id}/status`}
                    className="text-primary underline"
                  >
                    View status
                  </Link>
                  {receipt && o.payment_status === "paid" && (
                    <Link
                      href={`/learner/orders/${o.id}/receipt`}
                      className="text-primary underline"
                    >
                      Receipt
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="border-y border-border py-8">
          <p>No purchases yet.</p>
          <Link
            href="/courses"
            className="mt-4 inline-block text-primary underline"
          >
            Browse courses
          </Link>
        </section>
      )}
    </DashboardShell>
  );
}
