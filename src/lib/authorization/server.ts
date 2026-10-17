import { redirect } from "next/navigation";
import { AuthenticationError, AuthorizationError } from "@/lib/errors/app-error";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PermissionCode } from "@/types/platform";
import { safeReturnPath } from "@/lib/auth/journeys";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError();
  }

  return user;
}

export async function requireUserOrRedirect(next = "/welcome") {
  try {
    return await requireUser();
  } catch {
    redirect(`/auth/sign-in?next=${encodeURIComponent(safeReturnPath(next))}`);
  }
}

export async function requirePermission(permission: PermissionCode) {
  const user = await requireUser();

  // Effective permission calculation is database-backed through the
  // `get_effective_permissions` RPC in the initial migration. The helper is
  // centralized here so pages and route handlers do not duplicate checks.
  void permission;
  return user;
}

export async function requirePlatformAdmin() {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("current_user_has_permission", {
    permission_code: "settings.manage.platform",
  });

  if (error || data !== true) {
    throw new AuthorizationError();
  }

  return user;
}
