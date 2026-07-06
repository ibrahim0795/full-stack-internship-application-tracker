"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApplicationStage,
  EmploymentType,
  WorkArrangement,
} from "@prisma/client";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import {
  applicationFormSchema,
  applicationStageLabels,
  employmentTypeLabels,
  type ApplicationFormValues,
  workArrangementLabels,
} from "./application-schema";
import {
  initialApplicationActionState,
  type ApplicationActionState,
} from "./application-state";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField, Input, Select, Textarea } from "@/components/ui/form-field";

interface ResumeOption {
  id: string;
  name: string;
}

interface ApplicationFormProps {
  action: (
    previousState: ApplicationActionState,
    formData: FormData,
  ) => Promise<ApplicationActionState>;
  defaultValues: ApplicationFormValues;
  resumes: ResumeOption[];
  submitLabel: string;
}

export function ApplicationForm({
  action,
  defaultValues,
  resumes,
  submitLabel,
}: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialApplicationActionState,
  );
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ApplicationFormValues>({
    defaultValues,
    resolver: zodResolver(applicationFormSchema),
  });

  function errorFor(field: keyof ApplicationFormValues) {
    return errors[field]?.message ?? state.fieldErrors?.[field]?.[0];
  }

  const submit = handleSubmit((values) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) formData.set(key, value);
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
          <h2 className="text-foreground text-xl font-semibold">Opportunity</h2>
          <p className="text-muted text-sm">
            Record the role and the source you can return to later.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            error={errorFor("companyName")}
            htmlFor="companyName"
            label="Company name"
            required
          >
            <Input
              {...register("companyName")}
              aria-invalid={Boolean(errorFor("companyName"))}
              id="companyName"
            />
          </FormField>
          <FormField
            error={errorFor("positionTitle")}
            htmlFor="positionTitle"
            label="Position title"
            required
          >
            <Input
              {...register("positionTitle")}
              aria-invalid={Boolean(errorFor("positionTitle"))}
              id="positionTitle"
            />
          </FormField>
          <FormField
            error={errorFor("jobUrl")}
            htmlFor="jobUrl"
            label="Job URL"
          >
            <Input
              {...register("jobUrl")}
              aria-invalid={Boolean(errorFor("jobUrl"))}
              id="jobUrl"
              placeholder="https://company.com/jobs/..."
              type="url"
            />
          </FormField>
          <FormField
            error={errorFor("employmentType")}
            htmlFor="employmentType"
            label="Employment type"
          >
            <Select {...register("employmentType")} id="employmentType">
              {Object.values(EmploymentType).map((value) => (
                <option key={value} value={value}>
                  {employmentTypeLabels[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            className="md:col-span-2"
            error={errorFor("jobDescription")}
            htmlFor="jobDescription"
            label="Job description"
          >
            <Textarea
              {...register("jobDescription")}
              aria-invalid={Boolean(errorFor("jobDescription"))}
              id="jobDescription"
              rows={8}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-foreground text-xl font-semibold">Progress</h2>
          <p className="text-muted text-sm">
            Keep stage, dates, location, and salary useful for reminders and
            analytics.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FormField error={errorFor("stage")} htmlFor="stage" label="Stage">
            <Select {...register("stage")} id="stage">
              {Object.values(ApplicationStage).map((value) => (
                <option key={value} value={value}>
                  {applicationStageLabels[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            error={errorFor("workArrangement")}
            htmlFor="workArrangement"
            label="Work arrangement"
          >
            <Select {...register("workArrangement")} id="workArrangement">
              {Object.values(WorkArrangement).map((value) => (
                <option key={value} value={value}>
                  {workArrangementLabels[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField error={errorFor("city")} htmlFor="city" label="City">
            <Input {...register("city")} id="city" />
          </FormField>
          <FormField
            error={errorFor("country")}
            htmlFor="country"
            label="Country"
          >
            <Input {...register("country")} id="country" />
          </FormField>
          <FormField
            error={errorFor("applicationDate")}
            htmlFor="applicationDate"
            label="Application date"
          >
            <Input
              {...register("applicationDate")}
              id="applicationDate"
              type="date"
            />
          </FormField>
          <FormField
            error={errorFor("closingDate")}
            htmlFor="closingDate"
            label="Closing date"
          >
            <Input {...register("closingDate")} id="closingDate" type="date" />
          </FormField>
          <FormField
            error={errorFor("interviewDate")}
            htmlFor="interviewDate"
            label="Interview date"
          >
            <Input
              {...register("interviewDate")}
              id="interviewDate"
              type="date"
            />
          </FormField>
          <FormField
            error={errorFor("salaryMinimum")}
            htmlFor="salaryMinimum"
            label="Salary minimum"
          >
            <Input
              {...register("salaryMinimum")}
              id="salaryMinimum"
              inputMode="decimal"
              min="0"
              step="0.01"
              type="number"
            />
          </FormField>
          <FormField
            error={errorFor("salaryMaximum")}
            htmlFor="salaryMaximum"
            label="Salary maximum"
          >
            <Input
              {...register("salaryMaximum")}
              id="salaryMaximum"
              inputMode="decimal"
              min="0"
              step="0.01"
              type="number"
            />
          </FormField>
          <FormField
            error={errorFor("currency")}
            htmlFor="currency"
            label="Currency"
          >
            <Input
              {...register("currency")}
              id="currency"
              maxLength={3}
              placeholder="PKR"
            />
          </FormField>
          <FormField
            error={errorFor("resumeId")}
            htmlFor="resumeId"
            label="CV version"
          >
            <Select {...register("resumeId")} id="resumeId">
              <option value="">No CV assigned</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            className="md:col-span-2"
            description="Separate skills with commas, for example: TypeScript, React, PostgreSQL."
            error={errorFor("tags")}
            htmlFor="tags"
            label="Required skills"
          >
            <Input {...register("tags")} id="tags" />
          </FormField>
          <FormField
            className="md:col-span-2 lg:col-span-3"
            error={errorFor("personalNotes")}
            htmlFor="personalNotes"
            label="Personal notes"
          >
            <Textarea
              {...register("personalNotes")}
              id="personalNotes"
              rows={5}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={pending} size="lg" type="submit">
          {pending ? (
            <LoaderCircle
              className="animate-spin"
              aria-hidden="true"
              size={18}
            />
          ) : (
            <ArrowRight aria-hidden="true" size={18} />
          )}
          {pending ? "Saving application…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
