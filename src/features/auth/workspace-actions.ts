"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { writeAuditEvent } from "@/lib/audit/audit";

export async function selectWorkspaceAction(form: FormData) {
  const user = await requireUserOrRedirect();
  const id = z.uuid().safeParse(form.get("workspaceId"));
  if (!id.success) redirect("/welcome");
  const db = await createServerSupabaseClient();
  const { data: member } = await db.from("workspace_members").select("workspaces(type)").eq("workspace_id", id.data).eq("user_id", user.id).eq("status", "active").single();
  if (!member) redirect("/welcome");
  const { error } = await db.from("user_preferences").update({ active_workspace_id: id.data }).eq("user_id", user.id);
  if (error) redirect("/welcome");
  await writeAuditEvent({ actorId: user.id, action: "workspace_selected", resourceType: "workspace", resourceId: id.data, workspaceId: id.data });
  const workspace = member.workspaces as unknown as { type: string };
  const routes: Record<string, string> = { personal_learning: "/learner", tutor: "/instructor", academy: "/academy", organization: "/organization", platform_admin: "/admin" };
  redirect(routes[workspace?.type] ?? "/welcome");
}
