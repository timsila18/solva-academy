import { PageHeading } from "@/components/dashboard/page-heading";
import { DataTable } from "@/components/dashboard/data-table";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/payments/money";

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("subscription_plans").select("name,audience,price_minor,currency,billing_interval,status").eq("status", "active").order("price_minor");
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <PageHeading title="Pricing" description="Plans are configurable. Enterprise and institutional contracts require confirmation before billing." />
      <DataTable title="Available plans" description="No hidden fake discounts or unverifiable claims are shown." headers={["Plan", "Audience", "Price", "Interval"]} rows={(data ?? []).map((plan) => [plan.name, plan.audience, formatMoney(plan.price_minor, plan.currency), plan.billing_interval])} empty="Pricing plans are being configured." />
    </main>
  );
}
