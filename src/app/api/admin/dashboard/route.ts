import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    await requireAdmin()
    const [publishedJobs, pendingSubmissions, pendingReviewJobs, newApplications, underReviewApps, closedJobs, failedNotifications, recentSubmissions] = await Promise.all([
      db.job.count({ where: { status: 'PUBLISHED' } }),
      db.jobSubmission.count({ where: { status: 'PENDING_REVIEW' } }),
      db.job.count({ where: { status: 'PENDING_REVIEW' } }),
      db.application.count({ where: { status: 'SUBMITTED' } }),
      db.application.count({ where: { status: 'UNDER_REVIEW' } }),
      db.job.count({ where: { status: 'CLOSED' } }),
      db.notification.count({ where: { status: 'FAILED' } }),
      db.jobSubmission.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: { company: true },
        where: { status: 'PENDING_REVIEW' },
      }),
    ])
    const recentApps = await db.application.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: { job: { include: { company: true } } },
    })
    return jsonOk({
      stats: {
        publishedJobs,
        pendingSubmissions,
        pendingReviewJobs,
        newApplications,
        underReviewApps,
        closedJobs,
        failedNotifications,
      },
      recentSubmissions,
      recentApplications: recentApps,
    })
  } catch (e) {
    return handleZodError(e)
  }
}
