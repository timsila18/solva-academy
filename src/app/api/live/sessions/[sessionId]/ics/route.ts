import { NextResponse } from "next/server";
import { createIcsEvent } from "@/lib/live/calendar";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("live_sessions").select("id,slug,title,short_description,starts_at,ends_at").eq("id", sessionId).single();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = createIcsEvent({ uid: data.id, title: data.title, description: data.short_description, startsAt: new Date(data.starts_at), endsAt: new Date(data.ends_at), url: `/live/${data.slug}` });
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${data.slug}.ics"`,
    },
  });
}
