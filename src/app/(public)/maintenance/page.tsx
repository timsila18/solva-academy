import { ButtonLink } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-semibold">Maintenance in progress</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Some financial or operational actions are temporarily paused while maintenance is active. Public pages and safe read-only areas may remain available.</p>
      <div className="mt-6"><ButtonLink href="/status" variant="outline">View status</ButtonLink></div>
    </main>
  );
}
