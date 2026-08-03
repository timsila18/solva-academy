import { createHash, randomBytes } from "crypto";

export const apiScopes = [
  "courses:read",
  "enrollments:read",
  "certificates:read",
  "live_sessions:read",
  "organization_users:read",
  "reports:read",
  "webhooks:write",
] as const;

export type ApiScope = (typeof apiScopes)[number];

export function generateApiSecret() {
  const raw = randomBytes(32).toString("base64url");
  return `sa_live_${raw}`;
}

export function hashApiSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function getApiKeyPrefix(secret: string) {
  return secret.slice(0, 14);
}

export function hasRequiredScopes(granted: string[], required: ApiScope[]) {
  return required.every((scope) => granted.includes(scope));
}

export function maskApiKey(secretOrPrefix: string) {
  if (secretOrPrefix.length <= 10) return "sa_********";
  return `${secretOrPrefix.slice(0, 7)}...${secretOrPrefix.slice(-4)}`;
}

export function normalizePagination(searchParams: URLSearchParams) {
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)));
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  return { limit, offset };
}
