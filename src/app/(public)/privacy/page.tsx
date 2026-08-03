import { PageHeading } from "@/components/dashboard/page-heading";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <PageHeading title="Privacy" description="Solva Academy supports consent records, privacy requests, retention policies, child-safety safeguards, and provider disclosures. This page is an operational notice, not legal certification." />
      <div className="space-y-4 text-sm leading-7 text-muted-foreground">
        <p>Users can request data export, correction, consent review, or deletion from the privacy settings page. Some records, including financial, certificate, audit, and safety records, may be retained where lawful retention is required.</p>
        <p>AI, live learning, payment, email, and monitoring providers must be configured and disclosed before production launch.</p>
      </div>
    </main>
  );
}
