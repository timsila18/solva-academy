export type HealthSignal = {
  service: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  latencyMs?: number;
  details?: Record<string, unknown>;
};

export function summarizeHealth(signals: HealthSignal[]) {
  if (!signals.length) return "unknown" as const;
  if (signals.some((signal) => signal.status === "down")) return "down" as const;
  if (signals.some((signal) => signal.status === "degraded" || (signal.latencyMs ?? 0) > 2000)) return "degraded" as const;
  if (signals.every((signal) => signal.status === "healthy")) return "healthy" as const;
  return "unknown" as const;
}

export function classifyLatency(latencyMs: number) {
  if (latencyMs >= 5000) return "critical";
  if (latencyMs >= 2000) return "high";
  if (latencyMs >= 1000) return "medium";
  return "info";
}
