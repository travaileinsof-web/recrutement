import { Suspense } from 'react'
import { SubmissionsList } from '@/components/admin/submissions-list'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Soumissions' }

export default function AdminSoumissionsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold">Soumissions</h1>
        <p className="mt-1 text-muted-foreground">
          Propositions d’offres soumises par les entreprises externes.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <SubmissionsList />
      </Suspense>
    </div>
  )
}
