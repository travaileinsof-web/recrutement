// Append-only audit log helper.
import { db } from '@/lib/db'
import { hashIp } from '@/lib/tokens'

export interface AuditContext {
  actorAdminId?: string | null
  action: string
  entityType: string
  entityId?: string | null
  beforeData?: unknown
  afterData?: unknown
  ip?: string | null
  userAgent?: string | null
}

// Recursively convert Date objects to ISO strings so the payload is
// JSON-compatible (Prisma's JsonValue in PostgreSQL doesn't accept Date directly).
function toJsonSafe(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(toJsonSafe)
  if (value instanceof Uint8Array) return Array.from(value)
  if (typeof value === 'object') {
    // Prisma Decimal / BigInt objects — convert to string
    if (typeof (value as any).toString === 'function') {
      // Skip if it looks like a plain object
      const ctor = (value as any).constructor?.name
      if (ctor === 'Decimal' || ctor === 'BigInt') {
        return (value as any).toString()
      }
    }
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = toJsonSafe(v)
    }
    return out
  }
  return value
}

function encode(value: unknown): string | null {
  if (value === undefined) return null
  return JSON.stringify(toJsonSafe(value))
}

export async function audit(entry: AuditContext): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorAdminId: entry.actorAdminId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        beforeData: encode(entry.beforeData),
        afterData: encode(entry.afterData),
        ipHash: entry.ip ? hashIp(entry.ip) : null,
        userAgent: entry.userAgent ?? null,
      },
    })
  } catch (err) {
    // Audit failure must never break the main flow — log and continue.
    console.error('[audit] failed to write audit log', err)
  }
}
