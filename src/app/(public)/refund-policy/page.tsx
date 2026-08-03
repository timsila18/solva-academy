import { PageHeading } from "@/components/dashboard/page-heading";

export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <PageHeading title="Refund policy" description="Refund request workflows are implemented with review, evidence, decision reason, audit logging, and entitlement preservation." />
      <p className="text-sm leading-7 text-muted-foreground">Refund rules remain configurable by course, academy, and platform policy. M-Pesa and provider-specific refund settlement must be verified before automated production refunds.</p>
    </main>
  );
}
