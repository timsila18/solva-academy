import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-black">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-semibold text-foreground">Solva Academy</p>
          <p className="mt-2">Learning by Solva Business Group.</p>
        </div>
        <Link href="/about">About</Link>
        <Link href="/help">Help</Link>
        <div className="grid gap-2">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refund-policy">Refund policy</Link>
        </div>
      </div>
    </footer>
  );
}
