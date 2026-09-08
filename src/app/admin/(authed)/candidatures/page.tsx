import { Suspense } from 'react'
import { ApplicationsList } from '@/components/admin/applications-list'
import { Skeleton } from '@/components/ui/skeleton'
import { serverFetch } from '@/lib/server-fetch'
import { requireAdmin } from '@/lib/auth'
import type { AdminApplication } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Candidatures' }

interface ApplicationsResponse {
  items: AdminApplication[]
  total: number
  totalPages: number
}

export default async function AdminCandidaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string; status?: string; search?: string; page?: string }>
}) {
  await requireAdmin()
  const sp = await searchParams
  const qs = new URLSearchParams()
  if (sp.jobId) qs.set('jobId', sp.jobId)
  if (sp.status) qs.set('status', sp.status)
  if (sp.search) qs.set('search', sp.search)
  qs.set('page', sp.page ?? '1')
  const initialData = await serverFetch<ApplicationsResponse>(
    `/api/admin/applications?${qs.toString()}`,
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold">Candidatures</h1>
        <p className="mt-1 text-muted-foreground">
          Toutes les candidatures reçues via le formulaire public.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ApplicationsList initialData={initialData} />
      </Suspense>
    </div>
  )
}
