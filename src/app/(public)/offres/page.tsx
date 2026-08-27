import Link from 'next/link'
import { Suspense } from 'react'
import { Briefcase, SearchX, SlidersHorizontal } from 'lucide-react'
import { JobCard } from '@/components/job-card'
import { JobsFilters } from '@/components/jobs-filters'
import { JobsPagination } from '@/components/jobs-pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { serverFetch } from '@/lib/server-fetch'
import type { PaginatedJobs } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function buildPaginationHref(
  baseParams: Record<string, string>,
  page: number,
): string {
  const sp = new URLSearchParams({ ...baseParams, page: String(page) })
  return `/offres?${sp.toString()}`
}

export default async function OffresPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const pick = (k: string) => {
    const v = sp[k]
    return Array.isArray(v) ? v[0] : v
  }

  const page = Math.max(1, Number(pick('page') ?? '1') || 1)
  const filters = {
    search: pick('search'),
    location: pick('location'),
    contractType: pick('contractType'),
    experienceLevel: pick('experienceLevel'),
    category: pick('category'),
    page,
    pageSize: 12,
  }

  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
  }

  const result = await serverFetch<PaginatedJobs>(`/api/public/jobs?${qs.toString()}`)
  const data = result ?? { items: [], total: 0, page, pageSize: 12, totalPages: 0 }

  const baseParams: Record<string, string> = {}
  for (const k of ['search', 'location', 'contractType', 'experienceLevel', 'category']) {
    const v = pick(k)
    if (v) baseParams[k] = v
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">Offres d’emploi</h1>
        <p className="mt-2 text-muted-foreground">
          {data.total > 0 ? (
            <>
              {data.total} offre{data.total > 1 ? 's' : ''} trouvée{data.total > 1 ? 's' : ''}
              {filters.category ? ` en « ${filters.category} »` : ''}
              {filters.contractType ? ` · ${filters.contractType}` : ''}
            </>
          ) : (
            'Aucune offre ne correspond à votre recherche pour le moment.'
          )}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <SlidersHorizontal className="size-4" />
                Filtres
              </div>
              <Suspense fallback={<FilterSkeleton />}>
                <JobsFilters current={filters} />
              </Suspense>
            </CardContent>
          </Card>
        </aside>

        <div>
          {data.items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                  <SearchX className="size-6 text-muted-foreground" />
                </div>
                <h2 className="font-serif text-xl font-semibold">Aucune offre trouvée</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Essayez d’élargir vos critères de recherche, ou réessayez
                  ultérieurement. De nouvelles offres sont publiées chaque semaine.
                </p>
                <Link
                  href="/offres"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Briefcase className="size-4" />
                  Voir toutes les offres
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {data.items.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <JobsPagination
            page={data.page}
            totalPages={data.totalPages}
            buildHref={(p) => buildPaginationHref(baseParams, p)}
          />
        </div>
      </div>
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}
