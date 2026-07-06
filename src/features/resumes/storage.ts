export type ResumeStorageReference =
  | { kind: "external-url"; url: string }
  | { key: string; kind: "managed-object" }
  | { kind: "metadata-only" };

export function resolveResumeStorage(resume: {
  fileUrl: string | null;
  storageKey: string | null;
}): ResumeStorageReference {
  if (resume.storageKey)
    return { key: resume.storageKey, kind: "managed-object" };
  if (resume.fileUrl) return { kind: "external-url", url: resume.fileUrl };
  return { kind: "metadata-only" };
}

export interface ResumeStorageProvider {
  createUpload(input: {
    contentType: string;
    filename: string;
    sizeBytes: number;
    userId: string;
  }): Promise<{ key: string; uploadUrl: string }>;
  getDownloadUrl(key: string, userId: string): Promise<string>;
  remove(key: string, userId: string): Promise<void>;
}
