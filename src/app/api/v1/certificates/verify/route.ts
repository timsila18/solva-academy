import { NextResponse, type NextRequest } from "next/server";
import { requireApiKey, recordApiUsage } from "@/lib/api/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const auth = await requireApiKey(request, ["certificates:read"]);
  if ("response" in auth) return auth.response;
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: { code: "missing_code", message: "Certificate verification code is required." } }, { status: 400 });
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase.rpc("verify_certificate", { code });
  const status = error ? 500 : 200;
  await recordApiUsage(auth.context, request, status, Date.now() - startedAt);
  return NextResponse.json(error ? { error: { code: "certificate_verify_failed", message: "Could not verify certificate." } } : { data: data?.[0] ?? null }, { status });
}
