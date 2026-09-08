import { NextRequest } from 'next/server'
import { getApplicationByTrackingToken } from '@/server/services/applications.service'
import { handleZodError, jsonOk, jsonError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const result = await getApplicationByTrackingToken(token)
    if (!result) return jsonError('TOKEN_INVALID', 'Lien invalable', 404)
    if ('revoked' in result && result.revoked) return jsonError('TOKEN_REVOKED', 'Lien révoqué', 410)
    if ('expired' in result && result.expired) return jsonError('TOKEN_EXPIRED', 'Lien expiré', 410)
    return jsonOk(result.application)
  } catch (e) {
    return handleZodError(e)
  }
}
