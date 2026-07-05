import "server-only";

import { compare, hash } from "bcryptjs";

const passwordRounds = 12;

export async function hashPassword(password: string) {
  return hash(password, passwordRounds);
}

export async function verifyPassword(password: string, passwordHash: string) {
  try {
    return await compare(password, passwordHash);
  } catch {
    return false;
  }
}
