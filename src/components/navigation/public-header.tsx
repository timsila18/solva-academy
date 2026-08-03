import Link from "next/link";
import { GraduationCap, Menu, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const publicLinks = [
  ["Pricing", "/pricing"],
  ["Schools", "/schools"],
  ["Skills", "/skills"],
  ["Paths", "/learning-paths"],
  ["Academies", "/academies"],
  ["Instructors", "/instructors"],
  ["Courses", "/courses"],
  ["Employers", "/employers"],
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="Solva Academy home">
          <span className="grid size-9 place-items-center rounded-md border border-border bg-[#05070a] text-primary">
            <GraduationCap size={20} aria-hidden />
          </span>
          <span>Solva Academy</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground lg:flex" aria-label="Public navigation">
          {publicLinks.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/courses" variant="outline" size="sm">
            <Search size={16} aria-hidden />
            Search
          </ButtonLink>
          <ButtonLink href="/auth/sign-in" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="/auth/sign-up" size="sm">
            Get started
          </ButtonLink>
        </div>
        <button className="grid size-10 place-items-center rounded-md border border-border bg-[#15171c] lg:hidden" aria-label="Open menu">
          <Menu size={20} aria-hidden />
        </button>
      </div>
    </header>
  );
}
