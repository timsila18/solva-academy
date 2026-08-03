import { log } from "@/lib/logging/logger";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function notifyUser({
  userId,
  type,
  title,
  body,
  resourceType,
  resourceId,
}: {
  userId: string;
  type: string;
  title: string;
  body: string;
  resourceType?: string;
  resourceId?: string;
}) {
  try {
    const supabase = createServiceSupabaseClient();
    await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title,
      body,
      resource_type: resourceType,
      resource_id: resourceId,
    });
  } catch (error) {
    log("error", "notification_write_failed", {
      type,
      userId,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
