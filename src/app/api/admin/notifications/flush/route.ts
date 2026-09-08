import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { flushNotifications } from '@/lib/notifications'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function POST(_req: NextRequest) {
  try {
    await requireAdmin()
    const count = await flushNotifications(50)
    return jsonOk({ sent: count })
  } catch (e) {
    return handleZodError(e)
  }
}
