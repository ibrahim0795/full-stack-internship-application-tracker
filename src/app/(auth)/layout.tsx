import type { ReactNode } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background relative isolate min-h-screen overflow-hidden">
      <div
        className="star-grid pointer-events-none absolute inset-0 -z-20 opacity-70"
        aria-hidden="true"
      />
      <div
        className="border-primary/15 pointer-events-none absolute top-1/2 left-[72%] -z-10 aspect-square w-[min(48rem,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border bg-[radial-gradient(circle,var(--ambient-primary),transparent_62%)] shadow-[0_0_120px_var(--primary-shadow)]"
        aria-hidden="true"
      />
      <header className="absolute inset-x-0 top-0 z-10 flex min-h-18 items-center justify-between px-5 sm:px-8 lg:px-10">
        <BrandMark />
        <ThemeToggle />
      </header>
      <main className="grid min-h-screen place-items-center px-5 pt-28 pb-12 sm:px-8">
        {children}
      </main>
    </div>
  );
}
