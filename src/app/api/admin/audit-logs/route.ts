import { NextRequest } from 'next/server'
import { requireAdminRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdminRole('ADMIN')
    const url = new URL(req.url)
    const actor = url.searchParams.get('actor') || undefined
    const action = url.searchParams.get('action') || undefined
    const entityType = url.searchParams.get('entityType') || undefined
    const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : 1
    const pageSize = 50

    const where = {
      AND: [
        actor ? { actorAdminId: actor } : {},
        action ? { action: { contains: action } } : {},
        entityType ? { entityType } : {},
      ],
    }
    const [total, items] = await Promise.all([
      db.auditLog.count({ where }),
      db.auditLog.findMany({
        where,
        include: { actor: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])
    return jsonOk({ items, total, page, pageSize })
  } catch (e) {
    return handleZodError(e)
  }
}
