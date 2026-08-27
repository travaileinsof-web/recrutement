import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JobForm } from '@/components/admin/job-form'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Créer une offre' }

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 gap-1.5">
          <Link href="/admin/offres">
            <ArrowLeft className="size-4" />
            Retour aux offres
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold">Créer une offre</h1>
        <p className="mt-1 text-muted-foreground">
          L’offre sera créée en statut <span className="font-medium">Brouillon</span>.
          Vous pourrez la publier une fois prête.
        </p>
      </div>
      <JobForm />
    </div>
  )
}
