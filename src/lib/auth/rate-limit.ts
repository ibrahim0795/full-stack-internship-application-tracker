import "server-only";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  key: string;
  limit: number;
  now?: number;
  windowMs: number;
}

const globalForRateLimit = globalThis as unknown as {
  authRateLimits?: Map<string, RateLimitBucket>;
};

const authRateLimits =
  globalForRateLimit.authRateLimits ?? new Map<string, RateLimitBucket>();

if (process.env.NODE_ENV !== "production")
  globalForRateLimit.authRateLimits = authRateLimits;

export function checkAuthRateLimit({
  key,
  limit,
  now = Date.now(),
  windowMs,
}: RateLimitOptions) {
  const current = authRateLimits.get(key);

  if (!current || current.resetAt <= now) {
    authRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearAuthRateLimitsForTests() {
  authRateLimits.clear();
}
