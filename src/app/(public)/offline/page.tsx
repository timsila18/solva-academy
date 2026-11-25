import { ButtonLink } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-semibold">You are offline</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        You are offline. Reconnect to continue learning or make a payment.
      </p>
      <div className="mt-6">
        <ButtonLink href="/" variant="outline">
          Return home
        </ButtonLink>
      </div>
    </main>
  );
}
