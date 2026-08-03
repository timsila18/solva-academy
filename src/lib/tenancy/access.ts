import type { TenantAccess } from "@/types/tenant";

export function canAccessTenant(access: TenantAccess) {
  if (access.platformPermissions.includes("settings.manage.platform")) return true;
  if (access.ownerId === access.userId) return true;
  return access.memberWorkspaceIds.includes(access.workspaceId);
}

export function canManageTenant(access: TenantAccess) {
  if (access.platformPermissions.includes("settings.manage.platform")) return true;
  if (access.ownerId === access.userId) return true;
  return access.platformPermissions.includes(`${access.tenantKind}_settings.edit.${access.tenantKind}`);
}

export function canInviteToWorkspace(access: TenantAccess) {
  if (access.platformPermissions.includes("settings.manage.platform")) return true;
  if (access.ownerId === access.userId) return true;
  return access.platformPermissions.includes("invitation.manage.assigned");
}

export function isSameTenant(leftTenantId: string, rightTenantId: string) {
  return leftTenantId === rightTenantId;
}
