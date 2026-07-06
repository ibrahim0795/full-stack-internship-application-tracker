import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cloneElement, isValidElement } from "react";

import { cn } from "@/lib/utils/cn";

const controlClassName =
  "w-full rounded-2xl border border-border-strong bg-field px-4 text-foreground outline-none transition placeholder:text-muted/70 hover:border-primary/35 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:ring-danger/10";

export interface FormFieldProps {
  children: ReactNode;
  className?: string;
  description?: string;
  error?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
}

export function FormField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
  required,
}: FormFieldProps) {
  const describedBy = error
    ? `${htmlFor}-error`
    : description
      ? `${htmlFor}-description`
      : undefined;
  const control = isValidElement<{
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }>(children)
    ? cloneElement(children, {
        "aria-describedby": children.props["aria-describedby"] ?? describedBy,
        "aria-invalid": children.props["aria-invalid"] ?? Boolean(error),
      })
    : children;

  return (
    <div className={cn("space-y-2", className)}>
      <label
        className="text-foreground block text-sm font-semibold"
        htmlFor={htmlFor}
      >
        {label}
        {required ? <span className="text-danger ml-1">*</span> : null}
      </label>
      {control}
      {description && !error ? (
        <p id={`${htmlFor}-description`} className="text-muted text-sm">
          {description}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="text-danger text-sm font-medium"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={cn(controlClassName, "min-h-11", className)} {...props} />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(controlClassName, "min-h-28 resize-y py-3", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(controlClassName, "min-h-11", className)}
      {...props}
    />
  );
}
