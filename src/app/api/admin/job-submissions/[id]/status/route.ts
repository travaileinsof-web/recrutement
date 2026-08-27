import { NextRequest } from 'next/server'
import { adminSetSubmissionStatus } from '@/server/services/submissions.service'
import { createJobFromSubmission } from '@/server/services/jobs.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, jsonError, handleZodError } from '@/lib/errors'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const PatchSchema = z.object({
  status: z.enum([
    'DRAFT',
    'SUBMITTED',
    'EMAIL_UNVERIFIED',
    'PENDING_REVIEW',
    'NEEDS_CORRECTION',
    'APPROVED',
    'REJECTED',
    'CONVERTED_TO_JOB',
    'CANCELLED',
  ]),
  correctionMessage: z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const data = PatchSchema.parse(body)

    if (data.status === 'CONVERTED_TO_JOB') {
      const job = await createJobFromSubmission(id, admin.id)
      return jsonOk({ job, converted: true })
    }

    const updated = await adminSetSubmissionStatus(id, data.status, admin.id, data.correctionMessage)
    return jsonOk(updated)
  } catch (e: any) {
    if (e?.message === 'SUBMISSION_NOT_FOUND') {
      return jsonError('NOT_FOUND', 'Soumission introuvable', 404)
    }
    return handleZodError(e)
  }
}
