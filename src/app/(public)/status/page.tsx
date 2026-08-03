import { PageHeading } from "@/components/dashboard/page-heading";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatusPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <PageHeading title="Platform status" description="Public status for Solva Academy services. Detailed internal incidents remain private." />
      <div className="grid gap-4 md:grid-cols-3">
        {["Web app", "Payments", "Live learning", "AI assistant", "Support"].map((service) => (
          <Card key={service}>
            <CardHeader><CardTitle>{service}</CardTitle><CardDescription>Status updates will appear here after monitoring is connected.</CardDescription></CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
