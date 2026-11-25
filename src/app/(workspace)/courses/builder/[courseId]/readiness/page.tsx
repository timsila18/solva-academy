import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, AlertCircle, Clock3, ChevronRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUserOrRedirect } from "@/lib/authorization/server";
import { getLaunchReadiness } from "@/lib/courses/launch-data";
export default async function LaunchReadinessPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const user = await requireUserOrRedirect();
  const { courseId } = await params;
  const data = await getLaunchReadiness(courseId, user.id);
  if (!data) notFound();
  const labels = {
    ready: "Ready",
    needed: "Needs attention",
    suggested: "Suggested",
    waiting: "Waiting",
  };
  return (
    <DashboardShell>
      <section className="max-w-4xl">
        <Link
          href={`/courses/builder/${courseId}`}
          className="text-sm text-primary underline"
        >
          Back to Course Studio
        </Link>
        <h1 className="mt-5 text-2xl font-semibold">Launch checklist</h1>
        <p className="mt-2 text-muted-foreground">{data.studio.course.title}</p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-5 text-sm">
          <p>
            <span className="font-semibold">Review:</span>{" "}
            {data.readyForReview ? "Ready to submit" : "Preparation needed"}
          </p>
          <p>
            <span className="font-semibold">Enrollment:</span>{" "}
            {data.readyForLaunch ? "Ready" : "Not open yet"}
          </p>
        </div>
        {(["review", "launch", "recommended"] as const).map((group) => (
          <section key={group} className="mt-8">
            <h2 className="text-base font-semibold">
              {group === "review"
                ? "Before review"
                : group === "launch"
                  ? "Before selling"
                  : "Recommended"}
            </h2>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {data.items
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon =
                    item.status === "ready"
                      ? CheckCircle2
                      : item.status === "waiting"
                        ? Clock3
                        : AlertCircle;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-start gap-3 py-4"
                    >
                      <Icon
                        size={18}
                        aria-hidden="true"
                        className={`mt-0.5 shrink-0 ${item.status === "ready" ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap justify-between gap-2">
                          <h3 className="text-sm font-medium">{item.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {labels[item.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-muted-foreground"
                      />
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
        <p className="mt-6 text-sm text-muted-foreground">
          This checklist does not publish your course or take a payment.
        </p>
      </section>
    </DashboardShell>
  );
}
