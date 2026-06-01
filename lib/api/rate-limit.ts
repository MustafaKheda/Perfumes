import { NextResponse } from "next/server";

type RateLimitOptions = {
  id: string;
  limit: number;
  windowMs: number;
};

type Bucket = {
  resetAt: number;
  count: number;
};

// In-memory limiter (single instance). For multi-instance deployments use Redis/Upstash.
const buckets = new Map<string, Bucket>();

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export function rateLimitOrResponse(
  request: Request,
  options: RateLimitOptions,
): NextResponse | null {
  const ip = getClientIp(request);
  const key = `${options.id}:${ip}`;
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { resetAt: now + options.windowMs, count: 1 });
    return null;
  }

  existing.count += 1;
  if (existing.count <= options.limit) {
    return null;
  }

  const retryAfterSeconds = Math.max(Math.ceil((existing.resetAt - now) / 1000), 1);
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

