import type {
  ActiveContext,
  PermissionAssignment,
  PermissionCode,
  ResourceContext,
} from "@/types/platform";

export const protectedRoleSlugs = [
  "founding-super-admin",
  "super-admin",
  "platform-administrator",
] as const;

export const foundingAdminEmail = "timsila18@gmail.com";

export function isActiveAssignment(assignment: PermissionAssignment, now = new Date()) {
  if (assignment.status && assignment.status !== "active") return false;
  if (assignment.startsAt && new Date(assignment.startsAt) > now) return false;
  if (assignment.expiresAt && new Date(assignment.expiresAt) < now) return false;
  return true;
}

export function hasPermission(
  context: ActiveContext,
  assignments: PermissionAssignment[],
  permission: PermissionCode,
  resource: ResourceContext = {},
) {
  if (context.accountStatus && context.accountStatus !== "active") return false;

  return assignments.some((assignment) => {
    if (!isActiveAssignment(assignment)) return false;
    if (assignment.code !== permission) return false;

    if (assignment.scope === "platform") return true;
    if (assignment.scope === "own") return resource.ownerId === context.userId;
    if (assignment.scope === "assigned") {
      return Boolean(
        assignment.workspaceId &&
          context.activeWorkspaceId &&
          assignment.workspaceId === context.activeWorkspaceId,
      );
    }
    if (assignment.scope === "academy") return assignment.tenantId === resource.academyId;
    if (assignment.scope === "organization") return assignment.tenantId === resource.organizationId;
    if (assignment.scope === "school") return assignment.tenantId === resource.schoolId;
    if (assignment.scope === "course") return assignment.tenantId === resource.workspaceId;

    return false;
  });
}

export function canRemoveRole(targetRoleSlug: string, isLastFoundingAdmin: boolean) {
  if (targetRoleSlug === "founding-super-admin") return false;
  if (isLastFoundingAdmin) return false;
  return true;
}

export function isProtectedRole(roleSlug: string) {
  return protectedRoleSlugs.includes(roleSlug as (typeof protectedRoleSlugs)[number]);
}
