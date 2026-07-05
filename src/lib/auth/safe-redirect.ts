export function getSafeRedirectPath(
  value: FormDataEntryValue | null,
  fallback = "/dashboard",
) {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;

  try {
    const url = new URL(value, "https://careerorbit.local");
    return url.origin === "https://careerorbit.local"
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
