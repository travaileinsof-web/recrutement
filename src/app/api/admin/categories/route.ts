import { NextRequest } from 'next/server'
import { requireAdmin, requireAdminRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const items = await db.category.findMany({ orderBy: { type: 'asc' } })
    return jsonOk({ items })
  } catch (e) {
    return handleZodError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminRole('ADMIN')
    const { name, type } = await req.json()
    if (!name || !type) return jsonOk({ ok: false, error: 'Champs manquants' })
    const cat = await db.category.create({ data: { name, type } })
    return jsonOk(cat)
  } catch (e) {
    return handleZodError(e)
  }
}
