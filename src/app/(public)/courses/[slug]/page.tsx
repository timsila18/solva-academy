import { createCheckoutAction, saveCourseAction } from "@/features/commerce/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";

export default async function PublicCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Card className="p-8">
        <p className="text-sm font-medium text-primary">Published course snapshot</p>
        <h1 className="mt-2 text-4xl font-semibold capitalize">{slug.replaceAll("-", " ")}</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          This route renders only published public course snapshots once Supabase content is connected. Draft edits never change the public course until a new version is approved and published.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge>Learning outcomes</Badge>
          <Badge>Skills</Badge>
          <Badge>Curriculum outline</Badge>
          <Badge>Assessment summary</Badge>
          <Badge>Certificate placeholder</Badge>
        </div>
        <div className="mt-6 grid gap-4 rounded-lg border border-border bg-muted p-4 md:grid-cols-2">
          <form action={saveCourseAction}>
            <input type="hidden" name="courseId" value="00000000-0000-0000-0000-000000000000" />
            <Button type="submit" variant="outline" className="w-full">Save course</Button>
          </form>
          <form action={createCheckoutAction} className="grid gap-2">
            <input type="hidden" name="courseId" value="00000000-0000-0000-0000-000000000000" />
            <input type="hidden" name="productId" value="00000000-0000-0000-0000-000000000000" />
            <input type="hidden" name="priceId" value="00000000-0000-0000-0000-000000000000" />
            <Button type="submit" className="w-full">Buy or enroll</Button>
            <p className="text-xs text-muted-foreground">Real product and price IDs are supplied from the published course snapshot once connected.</p>
          </form>
        </div>
      </Card>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {["About", "Target learners", "Prerequisites", "Curriculum", "Resources", "Assessments", "Completion requirements", "Preview lessons"].map((section) => (
          <EmptyState key={section} title={section} description="Real published snapshot data will render here. No fake ratings or learner counts are displayed." />
        ))}
      </div>
    </section>
  );
}
