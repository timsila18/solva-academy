import { NextResponse, type NextRequest } from "next/server";
import { requireApiKey, recordApiUsage } from "@/lib/api/auth";
import { normalizePagination } from "@/lib/api/keys";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const auth = await requireApiKey(request, ["courses:read"]);
  if ("response" in auth) return auth.response;
  const { limit, offset } = normalizePagination(request.nextUrl.searchParams);
  const supabase = createServiceSupabaseClient();
  const query = supabase
    .from("courses")
    .select("id,slug,title,short_description,status,visibility,academy_id,school_id,created_at")
    .eq("status", "published")
    .eq("visibility", "public")
    .range(offset, offset + limit - 1);
  const { data, error } = await query;
  const status = error ? 500 : 200;
  await recordApiUsage(auth.context, request, status, Date.now() - startedAt);
  return NextResponse.json(error ? { error: { code: "courses_query_failed", message: "Could not load courses." } } : { data, pagination: { limit, offset } }, { status });
}
