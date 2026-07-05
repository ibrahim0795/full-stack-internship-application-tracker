"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: "#principles", label: "Principles" },
];

const navigationLinkClassName =
  "rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-border/70 bg-background/78 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <BrandMark />
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link
              className={navigationLinkClassName}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            className={cn(
              buttonVariants({ size: "sm", variant: "ghost" }),
              "hidden md:inline-flex",
            )}
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden md:inline-flex",
            )}
            href="/register"
          >
            Create account
          </Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="text-foreground hover:bg-surface focus-visible:outline-focus grid size-11 place-items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? (
              <X aria-hidden="true" size={20} />
            ) : (
              <Menu aria-hidden="true" size={20} />
            )}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="border-border bg-background border-t px-5 py-4 md:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {navigation.map((item) => (
              <Link
                className={cn(navigationLinkClassName, "px-4 py-3")}
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "mt-3")}
              href="/login"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              className={buttonVariants()}
              href="/register"
              onClick={() => setMenuOpen(false)}
            >
              Create account
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
