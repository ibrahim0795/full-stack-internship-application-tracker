import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function ResumeNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <h2 className="text-foreground text-3xl font-semibold">
          CV unavailable
        </h2>
        <p className="text-muted mt-3">
          It may have been deleted or belongs to another account.
        </p>
        <Link className={buttonVariants({ className: "mt-6" })} href="/resumes">
          Back to CV manager
        </Link>
      </div>
    </div>
  );
}
