import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireSupabaseServerEnv, requireSupabaseServiceEnv } from "@/lib/config/env";
import { createClient } from "@supabase/supabase-js";

export async function createServerSupabaseClient() {
  const { url, anonKey } = requireSupabaseServerEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Route handlers and Server
          // Actions can; session refresh is also handled by proxy.
        }
      },
    },
  });
}

export function createServiceSupabaseClient() {
  const { url, serviceRoleKey } = requireSupabaseServiceEnv();
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
