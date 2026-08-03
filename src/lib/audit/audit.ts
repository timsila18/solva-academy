import { log } from "@/lib/logging/logger";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

type AuditEvent = {
  actorId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  workspaceId?: string | null;
  previousData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  reason?: string | null;
  success?: boolean;
  correlationId?: string | null;
};

export async function writeAuditEvent(event: AuditEvent) {
  try {
    const supabase = createServiceSupabaseClient();
    await supabase.from("audit_logs").insert({
      actor_id: event.actorId,
      action: event.action,
      resource_type: event.resourceType,
      resource_id: event.resourceId,
      workspace_id: event.workspaceId,
      previous_data: event.previousData,
      new_data: event.newData,
      reason: event.reason,
      success: event.success ?? true,
      correlation_id: event.correlationId,
    });
  } catch (error) {
    log("error", "audit_log_write_failed", {
      action: event.action,
      resourceType: event.resourceType,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
