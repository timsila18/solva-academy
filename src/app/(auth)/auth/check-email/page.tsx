import { Card } from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use the secure link from Supabase Auth to verify your email or continue password reset.</p>
      </Card>
    </section>
  );
}
