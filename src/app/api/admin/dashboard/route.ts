import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    await requireAdmin()

    // ----- Core stats -----
    const [publishedJobs, pendingSubmissions, pendingReviewJobs, newApplications, underReviewApps, closedJobs, failedNotifications, totalCompanies, totalApplications, totalJobs, recentSubmissions] = await Promise.all([
      db.job.count({ where: { status: 'PUBLISHED' } }),
      db.jobSubmission.count({ where: { status: 'PENDING_REVIEW' } }),
      db.job.count({ where: { status: 'PENDING_REVIEW' } }),
      db.application.count({ where: { status: 'SUBMITTED' } }),
      db.application.count({ where: { status: 'UNDER_REVIEW' } }),
      db.job.count({ where: { status: 'CLOSED' } }),
      db.notification.count({ where: { status: 'FAILED' } }),
      db.company.count(),
      db.application.count(),
      db.job.count(),
      db.jobSubmission.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: { company: true },
        where: { status: 'PENDING_REVIEW' },
      }),
    ])

    // ----- Recent applications -----
    const recentApps = await db.application.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: { job: { include: { company: true } } },
    })

    // ----- 7-day activity chart -----
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recentApps7d = await db.application.findMany({
      where: { submittedAt: { gte: sevenDaysAgo } },
      select: { submittedAt: true },
    })
    const recentSubs7d = await db.jobSubmission.findMany({
      where: { submittedAt: { gte: sevenDaysAgo } },
      select: { submittedAt: true },
    })

    // Build 7-day buckets
    const activity: Array<{ date: string; applications: number; submissions: number }> = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      const dayStr = d.toISOString().slice(0, 10)
      const apps = recentApps7d.filter((a) => a.submittedAt >= d && a.submittedAt < next).length
      const subs = recentSubs7d.filter((s) => s.submittedAt && s.submittedAt >= d && s.submittedAt < next).length
      activity.push({ date: dayStr, applications: apps, submissions: subs })
    }

    // ----- Priority actions (actionable items for admin) -----
    const pendingSubsList = await db.jobSubmission.findMany({
      where: { status: 'PENDING_REVIEW' },
      take: 5,
      orderBy: { submittedAt: 'asc' }, // oldest first = most urgent
      include: { company: true },
    })

    const unreviewedApps = await db.application.findMany({
      where: { status: 'SUBMITTED' },
      take: 5,
      orderBy: { submittedAt: 'asc' },
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
        totalCompanies,
        totalApplications,
        totalJobs,
      },
      activity,
      recentSubmissions,
      recentApplications: recentApps,
      priorityActions: {
        pendingSubmissions: pendingSubsList,
        unreviewedApplications: unreviewedApps,
      },
    })
  } catch (e) {
    return handleZodError(e)
  }
}
