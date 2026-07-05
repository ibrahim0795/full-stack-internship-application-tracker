import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        className="bg-primary text-primary-foreground focus:outline-focus fixed top-3 left-3 z-[100] -translate-y-24 rounded-full px-4 py-2 font-semibold transition focus:translate-y-0 focus:outline-2 focus:outline-offset-2"
        href="#main-content"
      >
        Skip to content
      </a>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </>
  );
}
