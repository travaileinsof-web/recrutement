import { NextRequest } from 'next/server'
import { signInAdmin, SESSION_COOKIE, SESSION_OPTIONS } from '@/lib/auth'
import { AdminLoginSchema } from '@/lib/validation'
import { handleZodError, jsonOk, jsonError } from '@/lib/errors'
import { audit } from '@/lib/audit'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = AdminLoginSchema.parse(body)
    const result = await signInAdmin(data.email, data.password)
    if (!result.ok) {
      return jsonError('INVALID_CREDENTIALS', result.error, 401)
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, result.token, SESSION_OPTIONS)

    await audit({
      actorAdminId: result.user.id,
      action: 'ADMIN_LOGIN',
      entityType: 'AdminUser',
      entityId: result.user.id,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
      userAgent: req.headers.get('user-agent'),
    })

    return jsonOk({ user: result.user })
  } catch (e) {
    return handleZodError(e)
  }
}
