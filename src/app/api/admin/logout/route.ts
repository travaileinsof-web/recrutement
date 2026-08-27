import { NextRequest } from 'next/server'
import { getCurrentAdmin, revokeSession, SESSION_COOKIE } from '@/lib/auth'
import { jsonOk } from '@/lib/errors'
import { audit } from '@/lib/audit'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await getCurrentAdmin()
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) await revokeSession(token)
  cookieStore.delete(SESSION_COOKIE)
  if (user) {
    await audit({
      actorAdminId: user.id,
      action: 'ADMIN_LOGOUT',
      entityType: 'AdminUser',
      entityId: user.id,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
      userAgent: req.headers.get('user-agent'),
    })
  }
  return jsonOk({ ok: true })
}
