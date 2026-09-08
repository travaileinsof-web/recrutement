import { Building2 } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { serverFetch } from '@/lib/server-fetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompaniesTable } from '@/components/admin/companies-table'
import type { AdminCompany } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminCompaniesPage() {
  await requireAdmin()
  const initialData = await serverFetch<{ items: AdminCompany[]; total: number }>(
    '/api/admin/companies',
  )
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Entreprises
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Répertoire administratif des entreprises ayant soumis ou publié des offres via la plateforme.
        </p>
      </header>

      <CompaniesTable initialData={initialData} />

      <p className="text-xs text-muted-foreground">
        Les entreprises externes ne possèdent pas de compte utilisateur. Cet écran est un répertoire
        administratif en lecture seule — il ne permet pas à une entreprise de se connecter ou de modifier ses
        données, conformément à la contrainte d&apos;absence de comptes publics.
      </p>
    </div>
  )
}
