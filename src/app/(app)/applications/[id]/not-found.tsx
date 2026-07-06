import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function ApplicationNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-primary-strong text-sm font-semibold tracking-[0.16em] uppercase">
          Not found
        </p>
        <h2 className="text-foreground mt-3 text-3xl font-semibold">
          Application unavailable
        </h2>
        <p className="text-muted mt-3 max-w-md">
          It may have been deleted, or it belongs to another account.
        </p>
        <Link
          className={buttonVariants({ className: "mt-6" })}
          href="/applications"
        >
          Back to applications
        </Link>
      </div>
    </div>
  );
}
