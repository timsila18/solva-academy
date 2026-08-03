import { describe, expect, it } from "vitest";
import { rankRecommendations } from "@/lib/ai/recommendations";

describe("AI recommendations", () => {
  it("prioritizes mandatory and interest-matching learning", () => {
    const ranked = rankRecommendations(
      [
        { id: "a", title: "Payroll compliance", type: "course", tags: ["payroll", "compliance"], mandatory: true, dueSoon: true },
        { id: "b", title: "Beginner guitar", type: "course", tags: ["music"], completed: false },
        { id: "c", title: "Old Excel", type: "course", tags: ["excel"], completed: true },
      ],
      { interests: ["payroll"], currentLevel: "beginner" },
    );
    expect(ranked).toHaveLength(2);
    expect(ranked[0].resourceId).toBe("a");
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });
});
