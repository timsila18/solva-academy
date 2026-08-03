import { describe, expect, it } from "vitest";
import { canRemoveRole, hasPermission, isProtectedRole } from "@/lib/authorization/permissions";

describe("authorization foundation", () => {
  it("grants own-scope permission only for owned resources", () => {
    const result = hasPermission(
      { userId: "user-a", accountStatus: "active" },
      [{ code: "profile.edit.own", scope: "own" }],
      "profile.edit.own",
      { ownerId: "user-a" },
    );

    expect(result).toBe(true);
  });

  it("denies own-scope permission for another user's resource", () => {
    const result = hasPermission(
      { userId: "user-a", accountStatus: "active" },
      [{ code: "profile.edit.own", scope: "own" }],
      "profile.edit.own",
      { ownerId: "user-b" },
    );

    expect(result).toBe(false);
  });

  it("prevents removing the protected founding role", () => {
    expect(canRemoveRole("founding-super-admin", false)).toBe(false);
  });

  it("protects the last active founding admin from lockout", () => {
    expect(canRemoveRole("super-admin", true)).toBe(false);
  });

  it("marks platform administrator roles as protected", () => {
    expect(isProtectedRole("platform-administrator")).toBe(true);
  });
});
