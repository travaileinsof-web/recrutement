import { NextRequest } from 'next/server'
import { adminUpdateJob, adminSetJobStatus } from '@/server/services/jobs.service'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { jsonOk, jsonError, handleZodError } from '@/lib/errors'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const job = await db.job.findUnique({
      where: { id },
      include: { company: true, sourceSubmission: true },
    })
    if (!job) return jsonError('NOT_FOUND', 'Offre introuvable', 404)
    return jsonOk(job)
  } catch (e) {
    return handleZodError(e)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const updated = await adminUpdateJob(id, body, admin.id)
    return jsonOk(updated)
  } catch (e: any) {
    if (e?.message === 'JOB_NOT_FOUND') return jsonError('NOT_FOUND', 'Offre introuvable', 404)
    return handleZodError(e)
  }
}

// Soft-delete = archive (never hard delete a job with applications)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const job = await db.job.findUnique({ where: { id }, include: { _count: { select: { applications: true } } } })
    if (!job) return jsonError('NOT_FOUND', 'Offre introuvable', 404)
    if (job._count.applications > 0) {
      // Force archive instead of delete
      const updated = await adminSetJobStatus(id, 'ARCHIVED', admin.id)
      return jsonOk({ archived: true, job: updated })
    }
    // Hard delete only if no applications
    await db.job.delete({ where: { id } })
    return jsonOk({ deleted: true })
  } catch (e) {
    return handleZodError(e)
  }
}
