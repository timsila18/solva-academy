import Link from "next/link";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireUserOrRedirect("/admin");
  const db = await createServerSupabaseClient();
  const { data, error } = await db.rpc("current_user_has_permission", { permission_code: "settings.manage.platform" });
  if (error || data !== true) return <main className="mx-auto max-w-lg px-4 py-12"><h1 className="text-2xl font-semibold">Administrator access required</h1><p className="mt-3 text-muted-foreground">This area is for platform administrators.</p><Link href="/welcome" className="mt-5 inline-block text-primary underline">Return to my account</Link></main>;
  return children;
}
