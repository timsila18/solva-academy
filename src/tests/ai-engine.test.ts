import { describe, expect, it } from "vitest";
import { buildCapabilityPrompt } from "@/lib/ai/engine";

describe("AI engine prompt construction", () => {
  it("includes capability, language, and child safety mode", () => {
    const prompt = buildCapabilityPrompt({
      capability: "ai_tutor",
      prompt: "Help me revise payroll",
      language: "sw",
      childSafetyMode: true,
    });
    expect(prompt).toContain("Capability: ai_tutor");
    expect(prompt).toContain("Language: sw");
    expect(prompt).toContain("Child-safety mode: enabled");
  });
});
