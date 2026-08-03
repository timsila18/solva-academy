import { describe, expect, it } from "vitest";
import { validateRubricWeights } from "@/lib/courses/rubrics";

describe("rubric validation", () => {
  it("accepts weights that total 100", () => {
    expect(validateRubricWeights([{ name: "Accuracy", weight: 60 }, { name: "Clarity", weight: 40 }]).valid).toBe(true);
  });

  it("rejects invalid weighted totals", () => {
    const result = validateRubricWeights([{ name: "Accuracy", weight: 50 }, { name: "Clarity", weight: 20 }]);
    expect(result.valid).toBe(false);
    expect(result.total).toBe(70);
  });
});
