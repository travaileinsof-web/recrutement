// Simple in-memory rate limiter (per IP / per key) suitable for serverless
// hot-restart environments. For production, swap with Upstash Redis or similar.
//
// Uses a sliding window approximation: count requests within the last `windowMs`
// in an in-process Map. Falls back gracefully if state is lost (process restart)
// by simply allowing the request — the outer DB-level idempotency is the
// authoritative defense.

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt < now) {
    const bucket: Bucket = { count: 1, resetAt: now + windowMs }
    buckets.set(key, bucket)
    return { ok: true, remaining: max - 1, resetAt: bucket.resetAt }
  }

  if (existing.count >= max) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return {
    ok: true,
    remaining: max - existing.count,
    resetAt: existing.resetAt,
  }
}

// Periodic cleanup — prevents the map from growing unboundedly.
// Runs every 5 minutes.
let cleanupStarted = false
export function startRateLimitCleanup() {
  if (cleanupStarted) return
  cleanupStarted = true
  setInterval(
    () => {
      const now = Date.now()
      for (const [k, v] of buckets) {
        if (v.resetAt < now) buckets.delete(k)
      }
    },
    5 * 60 * 1000,
  ).unref?.()
}
