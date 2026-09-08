import { NextRequest } from 'next/server'
import { findPublicJobs } from '@/server/services/jobs.service'
import { handleZodError, jsonOk } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const filters = {
      search: url.searchParams.get('search') || undefined,
      location: url.searchParams.get('location') || undefined,
      contractType: url.searchParams.get('contractType') || undefined,
      experienceLevel: url.searchParams.get('experienceLevel') || undefined,
      category: url.searchParams.get('category') || undefined,
      page: url.searchParams.get('page') ? Number(url.searchParams.get('page')) : 1,
      pageSize: url.searchParams.get('pageSize') ? Number(url.searchParams.get('pageSize')) : 12,
    }
    const result = await findPublicJobs(filters)
    return jsonOk(result)
  } catch (e) {
    return handleZodError(e)
  }
}
