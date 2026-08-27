import { Suspense } from 'react'
import { JobsList } from '@/components/admin/jobs-list'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Offres' }

export default function AdminOffresPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold">Offres</h1>
        <p className="mt-1 text-muted-foreground">
          Gérez toutes les offres publiées sur la plateforme.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <JobsList />
      </Suspense>
    </div>
  )
}
