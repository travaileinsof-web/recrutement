import { findPublicJobBySlug } from '@/server/services/jobs.service'
import { handleZodError, jsonOk, jsonError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const job = await findPublicJobBySlug(slug)
    if (!job) return jsonError('JOB_NOT_FOUND', 'Offre introuvable', 404)
    return jsonOk(job)
  } catch (e) {
    return handleZodError(e)
  }
}
