import { NextRequest } from 'next/server'
import { adminListApplications } from '@/server/services/applications.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const url = new URL(req.url)
    const result = await adminListApplications({
      jobId: url.searchParams.get('jobId') || undefined,
      status: url.searchParams.get('status') || undefined,
      search: url.searchParams.get('search') || undefined,
      page: url.searchParams.get('page') ? Number(url.searchParams.get('page')) : 1,
      pageSize: url.searchParams.get('pageSize') ? Number(url.searchParams.get('pageSize')) : 20,
    })
    return jsonOk(result)
  } catch (e) {
    return handleZodError(e)
  }
}
