export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "suspended"
  | "archived"
  | "closed";

export type ReviewDecision = "approve" | "reject" | "request_changes" | "suspend" | "archive";

export type InvitationStatus = "pending" | "accepted" | "rejected" | "cancelled" | "expired";

export type TenantKind = "academy" | "organization";

export type TenantAccess = {
  userId: string;
  tenantId: string;
  tenantKind: TenantKind;
  workspaceId: string;
  ownerId?: string | null;
  memberWorkspaceIds: string[];
  platformPermissions: string[];
};
