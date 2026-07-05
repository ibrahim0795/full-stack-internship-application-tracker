import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";

export function MarketingFooter() {
  return (
    <footer className="border-border bg-surface/35 border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <BrandMark />
          <p className="text-muted mt-3 max-w-sm text-sm leading-6">
            A focused command centre for the journey from saved opportunity to
            offer.
          </p>
        </div>
        <div className="text-muted flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link className="hover:text-foreground" href="#features">
            Features
          </Link>
          <Link className="hover:text-foreground" href="#workflow">
            Workflow
          </Link>
          <Link className="hover:text-foreground" href="/login">
            Sign in
          </Link>
          <Link className="hover:text-foreground" href="/register">
            Create account
          </Link>
          <a
            className="hover:text-foreground"
            href="https://github.com/ibrahim0795/full-stack-internship-application-tracker"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
