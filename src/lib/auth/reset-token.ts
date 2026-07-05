import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/lib/db/prisma";

const resetTokenLifetimeMs = 30 * 60 * 1000;

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + resetTokenLifetimeMs);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.create({
      data: { expiresAt, tokenHash, userId },
    }),
  ]);

  return token;
}

export async function consumePasswordResetToken(
  token: string,
  passwordHash: string,
) {
  const tokenHash = hashResetToken(token);

  return prisma.$transaction(async (transaction) => {
    const resetToken = await transaction.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.expiresAt <= new Date()) return false;

    await transaction.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    await transaction.user.update({
      data: { passwordHash },
      where: { id: resetToken.userId },
    });
    await transaction.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });
    return true;
  });
}
