export function ownedWhere<T extends Record<string, unknown>>(
  userId: string,
  where: T,
): Omit<T, "userId"> & { userId: string } {
  if (!userId.trim()) throw new Error("An authenticated user ID is required.");
  return { ...where, userId };
}
