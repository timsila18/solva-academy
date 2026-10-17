import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  definition,
  className,
}: {
  label: string;
  value: string | number;
  definition: string;
  className?: string;
}) {
  return (
    <Card className={cn("min-h-28", className)}>
      <p className="text-sm font-medium text-muted-foreground" title={definition}>{label}</p>
      <p className="mt-3 break-words text-2xl font-semibold" aria-label={`${label}: ${value}`}>{value}</p>
      <span className="sr-only">{definition}</span>
    </Card>
  );
}

export function MetricsGrid({ metrics }: { metrics: Array<{ label: string; value: string | number; definition: string }> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
