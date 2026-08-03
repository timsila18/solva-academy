import { ButtonLink } from "@/components/ui/button";

export function QuickLinks({ links }: { links: Array<[string, string]> }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {links.map(([label, href]) => (
        <ButtonLink key={href} href={href} variant="outline" size="sm">{label}</ButtonLink>
      ))}
    </div>
  );
}
