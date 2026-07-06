"use client";

import { Trash2 } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

export function DeleteInterviewForm({
  action,
}: {
  action: () => Promise<void>;
}) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this interview and its preparation data?"))
      event.preventDefault();
  }
  return (
    <form action={action} onSubmit={confirmDelete}>
      <Button type="submit" variant="secondary">
        <Trash2 aria-hidden="true" size={16} /> Delete interview
      </Button>
    </form>
  );
}
