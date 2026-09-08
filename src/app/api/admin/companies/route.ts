import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const url = new URL(req.url)
    const search = url.searchParams.get('search') || undefined
    const where = search
      ? {
          OR: [
            { legalName: { contains: search } },
            { email: { contains: search } },
            { publicReference: { contains: search } },
          ],
        }
      : {}
    const [total, items] = await Promise.all([
      db.company.count({ where }),
      db.company.findMany({
        where,
        include: { _count: { select: { jobs: true, applications: true, submissions: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ])
    return jsonOk({ items, total })
  } catch (e) {
    return handleZodError(e)
  }
}
