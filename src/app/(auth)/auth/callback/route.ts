import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { safeReturnPath } from "@/lib/auth/journeys";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const cookieStore = await cookies();
    const recovering =
      cookieStore.get("sa-password-recovery")?.value === "requested";
    cookieStore.delete("sa-password-recovery");
    if (error)
      return NextResponse.redirect(
        new URL(
          recovering
            ? "/auth/forgot-password?error=expired"
            : "/auth/sign-in?error=auth",
          request.url,
        ),
      );
    if (recovering)
      return NextResponse.redirect(
        new URL("/auth/reset-password", request.url),
        {
          headers: {
            "Cache-Control": "no-store",
            "Referrer-Policy": "no-referrer",
          },
        },
      );
  }

  return NextResponse.redirect(
    new URL(safeReturnPath(requestUrl.searchParams.get("next")), request.url),
  );
}
