import { NextRequest } from 'next/server'
import { adminGetSubmission } from '@/server/services/submissions.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, jsonError, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const submission = await adminGetSubmission(id)
    if (!submission) return jsonError('NOT_FOUND', 'Soumission introuvable', 404)
    return jsonOk(submission)
  } catch (e) {
    return handleZodError(e)
  }
}
