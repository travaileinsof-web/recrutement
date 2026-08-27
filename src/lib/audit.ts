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

export async function audit(entry: AuditContext): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorAdminId: entry.actorAdminId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        beforeData:
          entry.beforeData === undefined ? null : JSON.stringify(entry.beforeData),
        afterData:
          entry.afterData === undefined ? null : JSON.stringify(entry.afterData),
        ipHash: entry.ip ? hashIp(entry.ip) : null,
        userAgent: entry.userAgent ?? null,
      },
    })
  } catch (err) {
    // Audit failure must never break the main flow — log and continue.
    console.error('[audit] failed to write audit log', err)
  }
}
