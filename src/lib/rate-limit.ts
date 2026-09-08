// Rate limiter with two backends:
//
// - Production: Upstash Redis (@upstash/redis or REST). Set UPSTASH_REDIS_REST_URL
//   and UPSTASH_REDIS_REST_TOKEN. Works across serverless instances.
// - Dev fallback: in-memory sliding window (single-process only).
//
// Public API is identical between the two: rateLimit(key, max, windowMs) → { ok, remaining, resetAt }.

interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
}

interface RateLimiterBackend {
  limit(key: string, max: number, windowMs: number): Promise<RateLimitResult>
}

// ---------------------------------------------------------------------------
// In-memory backend (dev fallback)
// ---------------------------------------------------------------------------

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

class InMemoryRateLimiter implements RateLimiterBackend {
  async limit(key: string, max: number, windowMs: number): Promise<RateLimitResult> {
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
}

// ---------------------------------------------------------------------------
// Upstash Redis REST backend (production)
// ---------------------------------------------------------------------------

class UpstashRateLimiter implements RateLimiterBackend {
  constructor(private restUrl: string, private restToken: string) {}

  async limit(key: string, max: number, windowMs: number): Promise<RateLimitResult> {
    // Sliding window via two counters: count + resetAt timestamp.
    // We use a Lua-style pipeline: INCR + EXPIRE if first time.
    // Upstash REST accepts pipeline arrays.
    const now = Date.now()
    const bucketKey = `rl:${key}`
    const ttlSeconds = Math.ceil(windowMs / 1000)

    // First, check the current count and TTL in a single pipeline call.
    const pipeline = [
      ['INCR', bucketKey],
      ['EXPIRE', bucketKey, ttlSeconds, 'NX', 'GT'],
      ['TTL', bucketKey],
    ]

    try {
      const res = await fetch(`${this.restUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.restToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipeline),
      })
      if (!res.ok) {
        // If Redis fails, fail open (don't block legitimate traffic).
        return { ok: true, remaining: max - 1, resetAt: now + windowMs }
      }
      const json = (await res.json()) as Array<{ result?: number; error?: string }>
      const count = json[0]?.result ?? 0
      // If EXPIRE didn't apply (key existed with longer TTL), don't override.
      // The TTL is informational here.

      if (count > max) {
        // Already exceeded — compute reset time from TTL.
        const ttl = json[2]?.result ?? ttlSeconds
        return { ok: false, remaining: 0, resetAt: now + ttl * 1000 }
      }

      return { ok: true, remaining: Math.max(0, max - count), resetAt: now + windowMs }
    } catch {
      // Network error — fail open.
      return { ok: true, remaining: max - 1, resetAt: now + windowMs }
    }
  }
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

let cachedBackend: RateLimiterBackend | null = null

function resolveBackend(): RateLimiterBackend {
  if (cachedBackend) return cachedBackend

  const restUrl = process.env.UPSTASH_REDIS_REST_URL
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (restUrl && restToken) {
    console.log('[rate-limit] Using Upstash Redis backend')
    cachedBackend = new UpstashRateLimiter(restUrl, restToken)
  } else {
    console.log('[rate-limit] No Upstash config — falling back to in-memory (single-process only)')
    cachedBackend = new InMemoryRateLimiter()
  }
  return cachedBackend
}

export function rateLimit(key: string, max: number, windowMs: number): Promise<RateLimitResult> {
  return resolveBackend().limit(key, max, windowMs)
}

// Periodic cleanup for the in-memory backend — prevents the map from growing unboundedly.
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
