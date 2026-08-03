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
    <Card className={cn("min-h-32", className)}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{definition}</p>
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
