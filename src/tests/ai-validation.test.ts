import { describe, expect, it } from "vitest";
import { aiTutorSchema, assessmentDraftSchema, translationSchema } from "@/lib/validation/ai";

describe("AI validation schemas", () => {
  it("validates tutor prompts with optional context", () => {
    const parsed = aiTutorSchema.parse({ question: "Explain NSSF", language: "en" });
    expect(parsed.question).toBe("Explain NSSF");
    expect(parsed.childSafetyMode).toBe(false);
  });

  it("limits generated assessment item count", () => {
    const parsed = assessmentDraftSchema.safeParse({ assessmentType: "quiz", topic: "PAYE", outcomes: "Understand PAYE", itemCount: 50 });
    expect(parsed.success).toBe(false);
  });

  it("requires translation text", () => {
    const parsed = translationSchema.safeParse({ sourceLanguage: "en", targetLanguage: "sw", text: "" });
    expect(parsed.success).toBe(false);
  });
});
