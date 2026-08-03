import { describe, expect, it } from "vitest";
import { generateBackupCodes, isSecurityEventHighRisk, maskSessionFingerprint } from "@/lib/security/mfa";

describe("security helpers", () => {
  it("masks session fingerprints", () => {
    expect(maskSessionFingerprint("abcdef123456")).toBe("abcd...3456");
  });

  it("detects high-risk security events", () => {
    expect(isSecurityEventHighRisk("new_device")).toBe(true);
    expect(isSecurityEventHighRisk("profile_view")).toBe(false);
  });

  it("generates backup code labels", () => {
    const codes = generateBackupCodes(2);
    expect(codes).toHaveLength(2);
    expect(codes[0]).toMatch(/^SA-01-/);
  });
});
