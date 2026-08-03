import { describe, expect, it } from "vitest";
import { canAccessTenant, canInviteToWorkspace, canManageTenant, isSameTenant } from "@/lib/tenancy/access";

describe("tenant access foundation", () => {
  const baseAccess = {
    userId: "user-a",
    tenantId: "academy-a",
    tenantKind: "academy" as const,
    workspaceId: "workspace-a",
    ownerId: "owner-a",
    memberWorkspaceIds: ["workspace-a"],
    platformPermissions: [],
  };

  it("allows a member to access their academy tenant", () => {
    expect(canAccessTenant(baseAccess)).toBe(true);
  });

  it("prevents cross-academy access when workspace membership differs", () => {
    expect(canAccessTenant({ ...baseAccess, workspaceId: "workspace-b" })).toBe(false);
  });

  it("allows owners to manage tenant settings", () => {
    expect(canManageTenant({ ...baseAccess, userId: "owner-a" })).toBe(true);
  });

  it("allows platform administrators across tenants by permission", () => {
    expect(canAccessTenant({ ...baseAccess, workspaceId: "workspace-b", platformPermissions: ["settings.manage.platform"] })).toBe(true);
  });

  it("requires owner, platform, or invitation permission to invite", () => {
    expect(canInviteToWorkspace({ ...baseAccess, platformPermissions: ["invitation.manage.assigned"] })).toBe(true);
  });

  it("compares tenant identifiers exactly", () => {
    expect(isSameTenant("organization-a", "organization-b")).toBe(false);
  });
});
