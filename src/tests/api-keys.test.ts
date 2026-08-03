import { describe, expect, it } from "vitest";
import { generateApiSecret, getApiKeyPrefix, hashApiSecret, hasRequiredScopes, maskApiKey, normalizePagination } from "@/lib/api/keys";

describe("API key utilities", () => {
  it("generates and hashes API secrets without storing raw values", () => {
    const secret = generateApiSecret();
    expect(secret).toMatch(/^sa_live_/);
    expect(getApiKeyPrefix(secret)).toBe(secret.slice(0, 14));
    expect(hashApiSecret(secret)).toHaveLength(64);
  });

  it("checks scopes and masks keys", () => {
    expect(hasRequiredScopes(["courses:read", "certificates:read"], ["courses:read"])).toBe(true);
    expect(hasRequiredScopes(["courses:read"], ["reports:read"])).toBe(false);
    expect(maskApiKey("sa_live_abcdef123456")).toContain("...");
  });

  it("normalizes pagination", () => {
    const params = new URLSearchParams("limit=500&offset=-4");
    expect(normalizePagination(params)).toEqual({ limit: 100, offset: 0 });
  });
});
