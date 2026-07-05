import { z } from "zod";

export const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  AUTH_GITHUB_ID: z.string().min(1).optional(),
  AUTH_GITHUB_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function readServerEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): ServerEnvironment {
  return serverEnvironmentSchema.parse(environment);
}
