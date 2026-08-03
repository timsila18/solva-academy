import { ButtonLink } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-semibold">You are offline</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Solva Academy can keep the public shell available, but private learning data, payments, live classes, AI, and support actions need a connection.</p>
      <div className="mt-6"><ButtonLink href="/" variant="outline">Return home</ButtonLink></div>
    </main>
  );
}
