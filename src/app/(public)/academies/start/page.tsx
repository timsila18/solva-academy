import { Card } from "@/components/ui/card";
import { AcademyApplicationForm } from "@/components/academies/application-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function StartAcademyPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: schools, error } = await supabase.from("schools").select("id,name")
    .eq("visibility", "public").in("status", ["published", "active"]).order("display_order").order("name");
  return <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Card>
    <h1 className="text-2xl font-semibold">Start your academy</h1>
    <p className="mt-2 text-sm text-muted-foreground">Tell us about your academy. Once approved, you can manage its courses and team in your academy workspace.</p>
    <AcademyApplicationForm schools={schools ?? []} loadFailed={Boolean(error)} signedIn={Boolean(user)} />
  </Card></section>;
}
