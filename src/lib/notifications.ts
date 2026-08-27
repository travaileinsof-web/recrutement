// Notification queue: writes a row in `notifications`. Sending itself is
// simulated (logs + marks as SENT) since there is no email provider in this
// environment. In production a worker would consume the queue and call an
// email provider (Resend, Postmark, etc.) with the templates from /emails/.

import { db } from '@/lib/db'

export interface NotificationPayload {
  recipientEmail: string
  type: string
  subject: string
  payload: Record<string, unknown>
}

export async function enqueueNotification(n: NotificationPayload): Promise<void> {
  await db.notification.create({
    data: {
      recipientEmail: n.recipientEmail,
      type: n.type,
      subject: n.subject,
      payload: JSON.stringify(n.payload ?? {}),
      status: 'PENDING',
    },
  })
}

// Simulate sending: mark PENDING notifications as SENT (in production this
// would be a background worker that calls the email provider).
export async function flushNotifications(limit = 25): Promise<number> {
  const pending = await db.notification.findMany({
    where: { status: 'PENDING' },
    take: limit,
    orderBy: { createdAt: 'asc' },
  })

  let count = 0
  for (const n of pending) {
    // Simulate send — log to console (in production: provider call).
    console.log(`[mail] → ${n.recipientEmail} | ${n.subject} | type=${n.type}`)
    await db.notification.update({
      where: { id: n.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        attempts: { increment: 1 },
      },
    })
    count++
  }
  return count
}
