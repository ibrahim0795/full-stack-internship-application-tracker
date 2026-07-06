import { z } from "zod";

export const resumeFormSchema = z.object({
  fileUrl: z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      try {
        return ["http:", "https:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    }, "Enter a complete URL beginning with http:// or https://."),
  isDefault: z.boolean(),
  mimeType: z.union([
    z.literal(""),
    z.enum([
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
  ]),
  name: z.string().trim().min(2, "Enter a CV name.").max(120),
  originalFilename: z.string().trim().max(255),
  sizeBytes: z
    .string()
    .trim()
    .refine(
      (value) => !value || (/^\d+$/.test(value) && Number(value) <= 20_000_000),
      "Enter a file size no larger than 20 MB.",
    ),
  targetRole: z.string().trim().max(160),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

export function resumeValuesFromFormData(formData: FormData) {
  return {
    fileUrl: String(formData.get("fileUrl") ?? ""),
    isDefault: formData.get("isDefault") === "on",
    mimeType: String(formData.get("mimeType") ?? ""),
    name: String(formData.get("name") ?? ""),
    originalFilename: String(formData.get("originalFilename") ?? ""),
    sizeBytes: String(formData.get("sizeBytes") ?? ""),
    targetRole: String(formData.get("targetRole") ?? ""),
  };
}
