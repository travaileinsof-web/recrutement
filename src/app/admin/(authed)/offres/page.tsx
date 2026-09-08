import { Suspense } from 'react'
import { JobsList } from '@/components/admin/jobs-list'
import { Skeleton } from '@/components/ui/skeleton'
import { serverFetch } from '@/lib/server-fetch'
import { requireAdmin } from '@/lib/auth'
import type { AdminJob } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Offres' }

interface JobsResponse {
  items: AdminJob[]
  total: number
  totalPages: number
}

export default async function AdminOffresPage({
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
  const initialData = await serverFetch<JobsResponse>(`/api/admin/jobs?${qs.toString()}`)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold">Offres</h1>
        <p className="mt-1 text-muted-foreground">
          Gérez toutes les offres publiées sur la plateforme.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <JobsList initialData={initialData} />
      </Suspense>
    </div>
  )
}
