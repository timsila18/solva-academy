import { NextResponse, type NextRequest } from "next/server";
import { hashApiSecret, hasRequiredScopes, type ApiScope } from "@/lib/api/keys";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export type ApiAuthContext = {
  apiKeyId: string;
  workspaceId?: string | null;
  academyId?: string | null;
  organizationId?: string | null;
  scopes: string[];
};

export async function requireApiKey(request: NextRequest, requiredScopes: ApiScope[]): Promise<{ context: ApiAuthContext } | { response: NextResponse }> {
  const authorization = request.headers.get("authorization") ?? "";
  const secret = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : request.headers.get("x-api-key") ?? "";
  if (!secret) {
    return { response: NextResponse.json({ error: { code: "missing_api_key", message: "API key is required." } }, { status: 401 }) };
  }

  const rate = checkRateLimit({ key: `api:${secret.slice(0, 16)}`, limit: 120, windowMs: 60_000 });
  if (!rate.allowed) {
    return { response: NextResponse.json({ error: { code: "rate_limited", message: "Too many API requests." } }, { status: 429 }) };
  }

  const supabase = createServiceSupabaseClient();
  const { data: key } = await supabase
    .from("api_keys")
    .select("id,workspace_id,academy_id,organization_id,scopes,status,expires_at")
    .eq("key_hash", hashApiSecret(secret))
    .maybeSingle();

  if (!key || key.status !== "active" || (key.expires_at && new Date(key.expires_at) <= new Date())) {
    return { response: NextResponse.json({ error: { code: "invalid_api_key", message: "API key is invalid or expired." } }, { status: 401 }) };
  }

  if (!hasRequiredScopes(key.scopes ?? [], requiredScopes)) {
    return { response: NextResponse.json({ error: { code: "insufficient_scope", message: "API key does not have the required scope." } }, { status: 403 }) };
  }

  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", key.id);
  return {
    context: {
      apiKeyId: key.id,
      workspaceId: key.workspace_id,
      academyId: key.academy_id,
      organizationId: key.organization_id,
      scopes: key.scopes ?? [],
    },
  };
}

export async function recordApiUsage(context: ApiAuthContext, request: NextRequest, statusCode: number, latencyMs: number) {
  const supabase = createServiceSupabaseClient();
  await supabase.from("api_key_usage").insert({
    api_key_id: context.apiKeyId,
    route: request.nextUrl.pathname,
    method: request.method,
    status_code: statusCode,
    latency_ms: latencyMs,
    idempotency_key: request.headers.get("idempotency-key"),
    user_agent: request.headers.get("user-agent"),
  });
}
