import { NextRequest } from 'next/server'
import { submitJobOffer } from '@/server/services/submissions.service'
import { handleZodError, jsonOk, jsonError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = clientIp(req)
    const userAgent = req.headers.get('user-agent')
    const result = await submitJobOffer(body, ip, userAgent)
    return jsonOk(result)
  } catch (e: any) {
    if (e?.message === 'HONEYPOT_TRIGGERED') {
      // Pretend success to confuse bots
      return jsonOk({ publicReference: 'SUB-HIDDEN-000000', id: 'rejected' })
    }
    if (e?.message === 'CAPTCHA_FAILED') {
      return jsonError('CAPTCHA_FAILED', 'Vérification anti-robot échouée', 422)
    }
    if (e?.message === 'RATE_LIMIT_EXCEEDED') {
      return jsonError('RATE_LIMIT', 'Trop de soumissions. Réessayez plus tard.', 429)
    }
    return handleZodError(e)
  }
}
