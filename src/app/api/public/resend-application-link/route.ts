import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashToken, generateToken } from '@/lib/tokens'
import { getSettings } from '@/lib/settings'
import { enqueueNotification } from '@/lib/notifications'
import { rateLimit } from '@/lib/rate-limit'
import { handleZodError, jsonOk, jsonError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// Regenerate a tracking link by email + public reference.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body?.email as string)?.trim().toLowerCase()
    const publicRef = (body?.publicReference as string)?.trim()

    if (!email || !publicRef) {
      return jsonError('VALIDATION_ERROR', 'E-mail et référence requis', 422)
    }

    const ip = clientIp(req)
    const rl = await rateLimit(`resend:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.ok) return jsonError('RATE_LIMIT', 'Trop de demandes. Réessayez plus tard.', 429)

    const app = await db.application.findFirst({
      where: { candidateEmail: email, publicReference: publicRef },
    })
    if (!app) {
      // Don't leak existence
      return jsonOk({ sent: true })
    }

    const settings = await getSettings()
    const token = generateToken(32)
    const ttlMs = settings.trackingLinkTtlHours * 60 * 60 * 1000
    await db.accessToken.create({
      data: {
        tokenHash: hashToken(token),
        purpose: 'APPLICATION_TRACKING',
        applicationId: app.id,
        expiresAt: new Date(Date.now() + ttlMs),
      },
    })

    await enqueueNotification({
      recipientEmail: email,
      type: 'APPLICATION_TRACKING_RESEND',
      subject: 'Votre lien de suivi de candidature',
      payload: {
        reference: app.publicReference,
        trackingUrlPath: `/suivi-candidature/${token}`,
      },
    })

    return jsonOk({ sent: true })
  } catch (e) {
    return handleZodError(e)
  }
}
