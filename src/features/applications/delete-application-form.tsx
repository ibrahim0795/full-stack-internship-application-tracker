"use client";

import { Trash2 } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

export function DeleteApplicationForm({
  action,
  companyName,
}: {
  action: (formData: FormData) => void | Promise<void>;
  companyName: string;
}) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (
      !window.confirm(
        `Delete the application at ${companyName}? This cannot be undone.`,
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={confirmDelete}>
      <Button type="submit" variant="secondary">
        <Trash2 aria-hidden="true" size={17} /> Delete application
      </Button>
    </form>
  );
}
