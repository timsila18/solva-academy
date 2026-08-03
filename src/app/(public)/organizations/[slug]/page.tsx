import { EmptyState } from "@/components/feedback/empty-state";

export default async function OrganizationPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">{slug.replaceAll("-", " ")}</h1>
      <p className="mt-3 text-muted-foreground">Public organization profiles render only when the organization enables public visibility.</p>
      <div className="mt-8"><EmptyState title="Organization learning profile" description="People, reports, billing, and private training data remain hidden." /></div>
    </section>
  );
}
