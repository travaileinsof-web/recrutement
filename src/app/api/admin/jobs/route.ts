import { NextRequest } from 'next/server'
import { adminListJobs, adminCreateJob } from '@/server/services/jobs.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const url = new URL(req.url)
    const result = await adminListJobs({
      search: url.searchParams.get('search') || undefined,
      status: url.searchParams.get('status') || undefined,
      page: url.searchParams.get('page') ? Number(url.searchParams.get('page')) : 1,
      pageSize: url.searchParams.get('pageSize') ? Number(url.searchParams.get('pageSize')) : 20,
    })
    return jsonOk(result)
  } catch (e) {
    return handleZodError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    const body = await req.json()
    const job = await adminCreateJob(body, admin.id)
    return jsonOk(job)
  } catch (e) {
    return handleZodError(e)
  }
}
