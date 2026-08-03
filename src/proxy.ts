import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/ai", "/learner", "/learn", "/checkout", "/courses/builder", "/live/create", "/live/calendar", "/live/classroom", "/live/reports", "/instructor", "/academy", "/organization", "/admin", "/settings", "/support"];
const unsafeDuringMaintenance = ["/checkout", "/api/payments", "/admin/billing", "/admin/revenue", "/instructor/payouts", "/academy/payouts"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (process.env.MAINTENANCE_MODE === "true" && unsafeDuringMaintenance.some((prefix) => pathname.startsWith(prefix))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/maintenance";
    return NextResponse.redirect(redirectUrl);
  }
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const hasSupabaseCookie = request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-"));
  if (!hasSupabaseCookie) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ai/:path*", "/learner/:path*", "/learn/:path*", "/checkout/:path*", "/courses/builder/:path*", "/live/create/:path*", "/live/calendar/:path*", "/live/classroom/:path*", "/live/reports/:path*", "/instructor/:path*", "/academy/:path*", "/organization/:path*", "/admin/:path*", "/settings/:path*", "/support/:path*"],
};
