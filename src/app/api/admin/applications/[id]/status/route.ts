import { NextRequest } from 'next/server'
import { adminSetApplicationStatus } from '@/server/services/applications.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, handleZodError } from '@/lib/errors'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const Schema = z.object({
  status: z.enum([
    'SUBMITTED',
    'RECEIVED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_COMPLETED',
    'WAITLISTED',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN',
  ]),
  publicMessage: z.string().max(2000).optional(),
  internalNote: z.string().max(5000).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const data = Schema.parse(body)
    const updated = await adminSetApplicationStatus(id, data.status, admin.id, {
      publicMessage: data.publicMessage,
      internalNote: data.internalNote,
    })
    return jsonOk(updated)
  } catch (e) {
    return handleZodError(e)
  }
}
