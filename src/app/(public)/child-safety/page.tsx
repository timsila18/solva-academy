import { PageHeading } from "@/components/dashboard/page-heading";

export default function ChildSafetyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <PageHeading title="Child safety" description="Solva Academy includes child profiles, guardian controls, live-class safety settings, restricted communication, reporting, and review workflows." />
      <p className="text-sm leading-7 text-muted-foreground">Country-specific rules require legal and safeguarding review before child-focused public launch. The platform does not treat AI or instructor verification as a guarantee of safety.</p>
    </main>
  );
}
