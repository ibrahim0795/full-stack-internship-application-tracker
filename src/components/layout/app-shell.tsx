import type { ReactNode } from "react";
import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils/cn";

export interface AppNavigationItem {
  active?: boolean;
  href: string;
  icon?: ReactNode;
  label: string;
}

export interface AppShellProps {
  children: ReactNode;
  navigation: AppNavigationItem[];
  title: string;
}

export function AppShell({ children, navigation, title }: AppShellProps) {
  return (
    <div className="bg-background min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <a
        className="bg-primary text-primary-foreground focus:outline-focus fixed top-3 left-3 z-[100] -translate-y-24 rounded-full px-4 py-2 font-semibold transition focus:translate-y-0 focus:outline-2 focus:outline-offset-2"
        href="#main-content"
      >
        Skip to content
      </a>
      <aside className="border-border bg-surface/45 hidden border-r p-5 lg:flex lg:flex-col">
        <BrandMark />
        <nav className="mt-10 grid gap-1" aria-label="Application navigation">
          {navigation.map((item) => (
            <Link
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "text-muted hover:bg-surface hover:text-foreground focus-visible:outline-focus flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2",
                item.active && "bg-primary/10 text-primary-strong",
              )}
              href={item.href}
              key={item.href}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="border-border bg-background/80 flex min-h-18 items-center justify-between border-b px-5 backdrop-blur-xl sm:px-8">
          <div className="lg:hidden">
            <BrandMark compact />
          </div>
          <h1 className="text-foreground text-lg font-semibold tracking-[-0.02em]">
            {title}
          </h1>
          <ThemeToggle />
        </header>
        <nav
          aria-label="Mobile application navigation"
          className="border-border bg-surface/35 flex gap-2 overflow-x-auto border-b px-5 py-3 lg:hidden"
        >
          {navigation.map((item) => (
            <Link
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "text-muted focus-visible:outline-focus inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2",
                item.active && "bg-primary/10 text-primary-strong",
              )}
              href={item.href}
              key={item.href}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-5 sm:p-8" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
