import { Suspense } from 'react'
import { ApplicationsList } from '@/components/admin/applications-list'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Candidatures' }

export default function AdminCandidaturesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold">Candidatures</h1>
        <p className="mt-1 text-muted-foreground">
          Toutes les candidatures reçues via le formulaire public.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ApplicationsList />
      </Suspense>
    </div>
  )
}
