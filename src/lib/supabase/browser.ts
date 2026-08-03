"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseServerEnv } from "@/lib/config/env";

export function createBrowserSupabaseClient() {
  const { url, anonKey } = requireSupabaseServerEnv();
  return createBrowserClient(url, anonKey);
}
