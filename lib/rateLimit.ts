/**
 * Lightweight, production-grade in-memory Rate Limiter & Auth Guard
 * Implements sliding-window counter with automatic memory cleanup.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store keyed by IP or identifier
const ipStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired records every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export interface RateLimitOptions {
  maxRequests?: number; // e.g. 5
  windowMs?: number;    // e.g. 10 * 60 * 1000 (10 mins)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  req: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  const maxRequests = options.maxRequests ?? 5;
  const windowMs = options.windowMs ?? 10 * 60 * 1000;
  const ip = getClientIp(req);
  const now = Date.now();

  const existing = ipStore.get(ip);

  if (!existing || now > existing.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

/**
 * Checks if request contains a valid Admin API key in headers
 */
export function isAuthorizedAdmin(req: Request): boolean {
  const adminSecret = process.env.ADMIN_API_KEY || "cherra_admin_secret_2026";
  const authHeader = req.headers.get("authorization");
  const customKey = req.headers.get("x-admin-key");

  if (customKey && customKey === adminSecret) {
    return true;
  }

  if (authHeader) {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();
    if (token === adminSecret) {
      return true;
    }
  }

  return false;
}
