import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/tenant/status-badge";

export function ReviewCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <StatusBadge status={status} />
      </div>
    </Card>
  );
}
