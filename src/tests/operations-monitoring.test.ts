import { describe, expect, it } from "vitest";
import { classifyLatency, summarizeHealth } from "@/lib/operations/monitoring";

describe("operations monitoring", () => {
  it("summarizes health from service signals", () => {
    expect(summarizeHealth([{ service: "web", status: "healthy" }, { service: "ai", status: "degraded" }])).toBe("degraded");
    expect(summarizeHealth([{ service: "db", status: "down" }])).toBe("down");
  });

  it("classifies latency severity", () => {
    expect(classifyLatency(500)).toBe("info");
    expect(classifyLatency(2500)).toBe("high");
    expect(classifyLatency(6000)).toBe("critical");
  });
});
