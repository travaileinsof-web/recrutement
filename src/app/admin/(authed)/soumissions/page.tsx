import { Suspense } from 'react'
import { SubmissionsList } from '@/components/admin/submissions-list'
import { Skeleton } from '@/components/ui/skeleton'
import { serverFetch } from '@/lib/server-fetch'
import { requireAdmin } from '@/lib/auth'
import type { AdminSubmission } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Soumissions' }

interface SubmissionsResponse {
  items: AdminSubmission[]
  total: number
  totalPages: number
}

export default async function AdminSoumissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
  await requireAdmin()
  const sp = await searchParams
  const qs = new URLSearchParams()
  if (sp.status) qs.set('status', sp.status)
  if (sp.search) qs.set('search', sp.search)
  qs.set('page', sp.page ?? '1')
  // Pre-fetch on the server so the initial render is synchronous with the DB.
  const initialData = await serverFetch<SubmissionsResponse>(
    `/api/admin/job-submissions?${qs.toString()}`,
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold">Soumissions</h1>
        <p className="mt-1 text-muted-foreground">
          Propositions d’offres soumises par les entreprises externes.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <SubmissionsList initialData={initialData} />
      </Suspense>
    </div>
  )
}
