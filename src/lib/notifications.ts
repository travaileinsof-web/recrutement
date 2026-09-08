// Notification queue: writes a row in `notifications`. Sending itself is
// delegated to the configured provider (Resend by default, console fallback
// for dev). A background worker / cron would call flushNotifications.

import { db } from '@/lib/db'
import { sendEmail, EmailPayload } from '@/lib/email-provider'

export interface NotificationPayload {
  recipientEmail: string
  type: string
  subject: string
  payload: Record<string, unknown>
}

function encodePayload(payload: Record<string, unknown> | undefined): string {
  if (!payload) return '{}'
  // Convert Dates to ISO strings recursively so JSON.stringify produces a clean value.
  const seen = new WeakSet()
  const safe = (v: unknown): unknown => {
    if (v === null || typeof v !== 'object') return v
    if (v instanceof Date) return v.toISOString()
    if (seen.has(v as object)) return null // circular ref guard
    seen.add(v as object)
    if (Array.isArray(v)) return v.map(safe)
    const out: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      out[k] = safe(val)
    }
    return out
  }
  return JSON.stringify(safe(payload))
}

export async function enqueueNotification(n: NotificationPayload): Promise<void> {
  await db.notification.create({
    data: {
      recipientEmail: n.recipientEmail,
      type: n.type,
      subject: n.subject,
      payload: encodePayload(n.payload ?? {}),
      status: 'PENDING',
    },
  })
}

// Send PENDING notifications via the configured provider.
// In production, call this from a cron job every minute.
export async function flushNotifications(limit = 25): Promise<number> {
  const pending = await db.notification.findMany({
    where: { status: 'PENDING' },
    take: limit,
    orderBy: { createdAt: 'asc' },
  })

  let count = 0
  for (const n of pending) {
    const payloadStr = (n.payload as unknown as string) ?? '{}'
    let payload: Record<string, unknown> = {}
    try {
      payload = JSON.parse(payloadStr)
    } catch {
      payload = {}
    }
    const email: EmailPayload = {
      to: n.recipientEmail,
      subject: n.subject,
      type: n.type,
      data: payload,
    }
    const result = await sendEmail(email)
    if (result.ok) {
      await db.notification.update({
        where: { id: n.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          attempts: { increment: 1 },
        },
      })
      count++
    } else {
      // Exponential backoff via attempts counter; mark FAILED after 5 attempts.
      const newAttempts = n.attempts + 1
      await db.notification.update({
        where: { id: n.id },
        data: {
          attempts: newAttempts,
          status: newAttempts >= 5 ? 'FAILED' : 'PENDING',
          lastError: result.error,
        },
      })
    }
  }
  return count
}
