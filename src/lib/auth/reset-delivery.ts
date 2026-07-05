import "server-only";

interface PasswordResetDelivery {
  email: string;
  token: string;
}

export async function deliverPasswordReset({
  email,
  token,
}: PasswordResetDelivery) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!apiKey || !from || !appUrl) return false;

  const resetUrl = new URL("/reset-password", appUrl);
  resetUrl.searchParams.set("token", token);

  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from,
      html: `<p>Use the secure link below to reset your CareerOrbit password. It expires in 30 minutes.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      subject: "Reset your CareerOrbit password",
      to: [email],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok)
    throw new Error(`Password reset delivery failed with ${response.status}`);
  return true;
}
