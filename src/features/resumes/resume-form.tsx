"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { resumeFormSchema, type ResumeFormValues } from "./resume-schema";
import { initialResumeState, type ResumeActionState } from "./resume-state";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField, Input, Select } from "@/components/ui/form-field";

export function ResumeForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (
    state: ResumeActionState,
    formData: FormData,
  ) => Promise<ResumeActionState>;
  defaultValues: ResumeFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialResumeState,
  );
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResumeFormValues>({
    defaultValues,
    resolver: zodResolver(resumeFormSchema),
  });
  function error(field: keyof ResumeFormValues) {
    return errors[field]?.message ?? state.fieldErrors?.[field]?.[0];
  }
  const submit = handleSubmit((values) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values))
      formData.set(key, String(value));
    if (values.isDefault) formData.set("isDefault", "on");
    else formData.delete("isDefault");
    startTransition(() => formAction(formData));
  });
  return (
    <form className="grid gap-6" onSubmit={submit}>
      {state.message ? (
        <p
          className="border-danger/30 bg-danger/10 text-danger rounded-2xl border px-4 py-3 text-sm"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
      <Card>
        <CardHeader>
          <h2 className="text-foreground text-xl font-semibold">CV identity</h2>
          <p className="text-muted text-sm">
            Use a clear name that explains which roles this version targets.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            error={error("name")}
            htmlFor="name"
            label="CV name"
            required
          >
            <Input {...register("name")} id="name" />
          </FormField>
          <FormField
            error={error("targetRole")}
            htmlFor="targetRole"
            label="Target role"
          >
            <Input {...register("targetRole")} id="targetRole" />
          </FormField>
          <label className="border-border bg-surface-raised flex items-start gap-3 rounded-2xl border p-4 md:col-span-2">
            <input
              {...register("isDefault")}
              className="mt-1 size-4"
              type="checkbox"
            />
            <span>
              <span className="text-foreground block text-sm font-semibold">
                Default CV
              </span>
              <span className="text-muted mt-1 block text-sm">
                Preselect this version for new applications. Only one CV can be
                default.
              </span>
            </span>
          </label>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-foreground text-xl font-semibold">
            File reference
          </h2>
          <p className="text-muted text-sm">
            This phase stores an external URL and metadata. It does not claim to
            upload or permanently host the file.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            className="md:col-span-2"
            error={error("fileUrl")}
            htmlFor="fileUrl"
            label="External file URL"
          >
            <Input
              {...register("fileUrl")}
              id="fileUrl"
              placeholder="https://drive.example.com/..."
              type="url"
            />
          </FormField>
          <FormField
            error={error("originalFilename")}
            htmlFor="originalFilename"
            label="Original filename"
          >
            <Input
              {...register("originalFilename")}
              id="originalFilename"
              placeholder="ibrahim-full-stack-cv.pdf"
            />
          </FormField>
          <FormField
            error={error("mimeType")}
            htmlFor="mimeType"
            label="File type"
          >
            <Select {...register("mimeType")} id="mimeType">
              <option value="">Not specified</option>
              <option value="application/pdf">PDF</option>
              <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                Word document
              </option>
            </Select>
          </FormField>
          <FormField
            error={error("sizeBytes")}
            htmlFor="sizeBytes"
            label="File size in bytes"
          >
            <Input
              {...register("sizeBytes")}
              id="sizeBytes"
              inputMode="numeric"
              min="0"
              type="number"
            />
          </FormField>
        </CardContent>
      </Card>
      <Button
        className="justify-self-end"
        disabled={pending}
        size="lg"
        type="submit"
      >
        {pending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" size={18} />
        ) : (
          <Save aria-hidden="true" size={18} />
        )}
        {pending ? "Saving CV…" : submitLabel}
      </Button>
    </form>
  );
}
