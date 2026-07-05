import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.");

const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .refine((password) => new TextEncoder().encode(password).length <= 72, {
    message: "Password must be 72 bytes or fewer.",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Include a lowercase letter.",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Include an uppercase letter.",
  })
  .refine((password) => /\d/.test(password), {
    message: "Include a number.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(72, "Password is too long."),
});

export const registrationSchema = z
  .object({
    name: z.string().trim().min(2, "Enter at least 2 characters.").max(60),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{64}$/i, "Reset link is invalid."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
