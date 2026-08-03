"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">The error has been handled with a safe message. Try again or contact support if it continues.</p>
        <Button onClick={reset} className="mt-6">Try again</Button>
      </div>
    </main>
  );
}
