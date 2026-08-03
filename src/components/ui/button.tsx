import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-[#0057d9]",
  secondary: "bg-white text-black shadow-sm hover:bg-[#e8eef8]",
  outline: "border border-border bg-[#15171c] text-foreground hover:border-primary hover:bg-[#101b2e] hover:text-white",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-error text-white shadow-sm hover:bg-[#d94343]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
