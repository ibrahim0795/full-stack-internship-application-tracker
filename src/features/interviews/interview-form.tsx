"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InterviewFormat, InterviewOutcome } from "@prisma/client";
import { LoaderCircle, Save } from "lucide-react";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import {
  interviewFormatLabels,
  interviewFormSchema,
  interviewOutcomeLabels,
  type InterviewFormValues,
} from "./interview-schema";
import {
  initialInterviewState,
  type InterviewActionState,
} from "./interview-state";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField, Input, Select, Textarea } from "@/components/ui/form-field";
import { zonedDateTimeToIso } from "@/lib/dates/timezone";

interface InterviewFormProps {
  action: (
    state: InterviewActionState,
    formData: FormData,
  ) => Promise<InterviewActionState>;
  applications: { companyName: string; id: string; positionTitle: string }[];
  defaultValues: InterviewFormValues;
  submitLabel: string;
}

export function InterviewForm({
  action,
  applications,
  defaultValues,
  submitLabel,
}: InterviewFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialInterviewState,
  );
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<InterviewFormValues>({
    defaultValues,
    resolver: zodResolver(interviewFormSchema),
  });

  function error(field: keyof InterviewFormValues) {
    return errors[field]?.message ?? state.fieldErrors?.[field]?.[0];
  }

  const submit = handleSubmit((values) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) formData.set(key, value);
    formData.set(
      "scheduledAt",
      zonedDateTimeToIso(values.scheduledAt, values.timezone),
    );
    formData.set(
      "followUpAt",
      values.followUpAt
        ? zonedDateTimeToIso(values.followUpAt, values.timezone)
        : "",
    );
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
          <h2 className="text-foreground text-xl font-semibold">
            Interview details
          </h2>
          <p className="text-muted text-sm">
            Connect the meeting to an application and keep the logistics clear.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            error={error("applicationId")}
            htmlFor="applicationId"
            label="Application"
            required
          >
            <Select {...register("applicationId")} id="applicationId">
              <option value="">Select an application</option>
              {applications.map((application) => (
                <option key={application.id} value={application.id}>
                  {application.companyName} — {application.positionTitle}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            error={error("format")}
            htmlFor="format"
            label="Format"
            required
          >
            <Select {...register("format")} id="format">
              {Object.values(InterviewFormat).map((value) => (
                <option key={value} value={value}>
                  {interviewFormatLabels[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            description={`Entered in ${defaultValues.timezone} and stored as UTC.`}
            error={error("scheduledAt")}
            htmlFor="scheduledAt"
            label="Scheduled date and time"
            required
          >
            <Input
              {...register("scheduledAt")}
              id="scheduledAt"
              type="datetime-local"
            />
          </FormField>
          <FormField error={error("outcome")} htmlFor="outcome" label="Outcome">
            <Select {...register("outcome")} id="outcome">
              {Object.values(InterviewOutcome).map((value) => (
                <option key={value} value={value}>
                  {interviewOutcomeLabels[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            error={error("locationOrLink")}
            htmlFor="locationOrLink"
            label="Location or meeting link"
          >
            <Input {...register("locationOrLink")} id="locationOrLink" />
          </FormField>
          <FormField
            description="Adds a follow-up event to your calendar."
            error={error("followUpAt")}
            htmlFor="followUpAt"
            label="Follow-up date and time"
          >
            <Input
              {...register("followUpAt")}
              id="followUpAt"
              type="datetime-local"
            />
          </FormField>
          <input {...register("timezone")} type="hidden" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-foreground text-xl font-semibold">
            People and preparation notes
          </h2>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            error={error("interviewerName")}
            htmlFor="interviewerName"
            label="Interviewer name"
          >
            <Input {...register("interviewerName")} id="interviewerName" />
          </FormField>
          <FormField
            error={error("interviewerRole")}
            htmlFor="interviewerRole"
            label="Interviewer role"
          >
            <Input {...register("interviewerRole")} id="interviewerRole" />
          </FormField>
          <FormField
            error={error("interviewerEmail")}
            htmlFor="interviewerEmail"
            label="Interviewer email"
          >
            <Input
              {...register("interviewerEmail")}
              id="interviewerEmail"
              type="email"
            />
          </FormField>
          <FormField
            className="md:col-span-2"
            error={error("notes")}
            htmlFor="notes"
            label="Interview notes"
          >
            <Textarea {...register("notes")} id="notes" rows={6} />
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
        {pending ? "Saving interview…" : submitLabel}
      </Button>
    </form>
  );
}
