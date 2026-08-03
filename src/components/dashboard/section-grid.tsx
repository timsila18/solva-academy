import { EmptyState } from "@/components/feedback/empty-state";

export function SectionGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(([title, description]) => (
        <EmptyState key={title} title={title} description={description} />
      ))}
    </div>
  );
}
