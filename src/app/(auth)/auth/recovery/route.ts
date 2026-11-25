import { NextResponse, NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const db = await createServerSupabaseClient();
  const result = code
    ? await db.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await db.auth.verifyOtp({ type: "recovery", token_hash: tokenHash })
      : null;
  if (!result || result.error)
    return NextResponse.redirect(
      new URL("/auth/forgot-password?error=expired", request.url),
    );
  return NextResponse.redirect(new URL("/auth/reset-password", request.url), {
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
