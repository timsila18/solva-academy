import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The page may have moved or is no longer available.</p>
        <ButtonLink href="/" className="mt-6">Go home</ButtonLink>
      </div>
    </main>
  );
}
