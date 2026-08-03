export type WorkspaceType =
  | "personal_learning"
  | "tutor"
  | "academy"
  | "organization"
  | "platform_admin";

export type AccountStatus =
  | "invited"
  | "registered"
  | "email_unverified"
  | "active"
  | "limited"
  | "under_review"
  | "temporarily_suspended"
  | "suspended"
  | "deactivated"
  | "archived"
  | "deleted"
  | "anonymized";

export type PermissionScope =
  | "own"
  | "assigned"
  | "course"
  | "academy"
  | "organization"
  | "school"
  | "platform";

export type PermissionCode = `${string}.${string}.${PermissionScope}`;

export type ActiveContext = {
  userId: string;
  activeRoleId?: string;
  activeRoleSlug?: string;
  activeWorkspaceId?: string;
  accountStatus?: AccountStatus;
};

export type PermissionAssignment = {
  code: PermissionCode;
  scope: PermissionScope;
  workspaceId?: string | null;
  resourceOwnerId?: string | null;
  tenantId?: string | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  status?: "active" | "inactive" | "expired" | "revoked";
};

export type ResourceContext = {
  ownerId?: string | null;
  workspaceId?: string | null;
  academyId?: string | null;
  organizationId?: string | null;
  schoolId?: string | null;
};
