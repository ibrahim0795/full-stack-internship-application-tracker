import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
  description: string;
  eyebrow: string;
  footer?: ReactNode;
  title: string;
}

export function AuthCard({
  children,
  description,
  eyebrow,
  footer,
  title,
}: AuthCardProps) {
  return (
    <Card className="border-border/80 bg-surface/92 w-full max-w-md p-6 sm:p-8">
      <p className="text-primary-strong text-xs font-semibold tracking-[0.16em] uppercase">
        {eyebrow}
      </p>
      <h1 className="text-foreground mt-4 text-3xl font-semibold tracking-[-0.04em]">
        {title}
      </h1>
      <p className="text-muted mt-3 text-sm leading-6">{description}</p>
      <div className="mt-7">{children}</div>
      {footer ? (
        <div className="border-border mt-7 border-t pt-6">{footer}</div>
      ) : null}
    </Card>
  );
}
