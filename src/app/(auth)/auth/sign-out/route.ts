import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  // A form POST must become a GET when returning to the homepage.
  return NextResponse.redirect(new URL("/", request.url), 303);
}
