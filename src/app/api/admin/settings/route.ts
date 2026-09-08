import { NextRequest } from 'next/server'
import { requireAdminRole } from '@/lib/auth'
import { getSettings, saveSettings } from '@/lib/settings'
import { SettingsSchema } from '@/lib/validation'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdminRole('ADMIN')
    const settings = await getSettings()
    return jsonOk(settings)
  } catch (e) {
    return handleZodError(e)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdminRole('ADMIN')
    const body = await req.json()
    const data = SettingsSchema.parse(body)
    await saveSettings(data)
    return jsonOk({ ok: true })
  } catch (e) {
    return handleZodError(e)
  }
}
