import { getCurrentAdmin } from '@/lib/auth'
import { jsonOk } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentAdmin()
  return jsonOk({ user })
}
