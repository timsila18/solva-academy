import { PageHeading } from "@/components/dashboard/page-heading";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <PageHeading title="Terms" description="Terms for learners, instructors, academies, organizations, live learning, AI assistance, subscriptions, billing, and support." />
      <p className="text-sm leading-7 text-muted-foreground">Final legal terms must be reviewed before public production launch. The product supports audit logs, consent records, and configurable policies to operationalize approved terms.</p>
    </main>
  );
}
