import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PublicHeader() {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  const links = [["Courses", "/courses"], ["Schools", "/schools"], ["Start an academy", "/academies/start"]];
  return <header className="sticky top-0 z-20 border-b border-border bg-background">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
      <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold" aria-label="Solva Academy home"><GraduationCap size={25} className="text-primary" aria-hidden="true" /><span>Solva Academy</span></Link>
      <nav className="hidden items-center gap-6 text-sm lg:flex" aria-label="Main navigation">{links.map(([label, href]) => <Link key={href} href={href} className="text-muted-foreground hover:text-foreground">{label}</Link>)}</nav>
      <div className="hidden items-center gap-2 lg:flex">{user ? <ButtonLink href="/welcome" size="sm">My account</ButtonLink> : <><ButtonLink href="/auth/sign-in" variant="ghost" size="sm">Sign in</ButtonLink><ButtonLink href="/auth/sign-up" size="sm">Create account</ButtonLink></>}</div>
      <details className="relative lg:hidden"><summary className="grid size-10 cursor-pointer list-none place-items-center rounded-md border border-border" aria-label="Open menu"><Menu size={20} /></summary><nav aria-label="Mobile navigation" className="absolute right-0 top-12 grid w-60 gap-1 rounded-md border border-border bg-background p-3 shadow-lg">{[...links, ...(user ? [["My account", "/welcome"]] : [["Sign in", "/auth/sign-in"], ["Create account", "/auth/sign-up"]])].map(([label, href]) => <Link key={href} href={href} className="px-3 py-2 text-sm hover:bg-muted">{label}</Link>)}</nav></details>
    </div>
  </header>;
}
