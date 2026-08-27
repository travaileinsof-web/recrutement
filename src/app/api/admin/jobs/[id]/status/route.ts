import { NextRequest } from 'next/server'
import { adminSetJobStatus } from '@/server/services/jobs.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, handleZodError } from '@/lib/errors'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const Schema = z.object({ status: z.string() })

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const { status } = Schema.parse(body)
    const updated = await adminSetJobStatus(id, status, admin.id)
    return jsonOk(updated)
  } catch (e) {
    return handleZodError(e)
  }
}
