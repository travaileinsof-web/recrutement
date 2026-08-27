import { NextRequest } from 'next/server'
import { createJobFromSubmission } from '@/server/services/jobs.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const job = await createJobFromSubmission(id, admin.id)
    return jsonOk(job)
  } catch (e) {
    return handleZodError(e)
  }
}
