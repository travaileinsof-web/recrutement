import { requireAdminRole } from '@/lib/auth'
import { serverFetch } from '@/lib/server-fetch'
import { SettingsPanel } from '@/components/admin/settings-panel'

interface Settings {
  appName: string
  contactEmail: string
  trackingLinkTtlHours: number
  maxFileSizeMb: number
  consentVersion: string
}

export default async function AdminSettingsPage() {
  await requireAdminRole('ADMIN')
  const initial = await serverFetch<Settings>('/api/admin/settings')
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configuration globale de la plateforme.
        </p>
      </header>

      <SettingsPanel initial={initial} />
    </div>
  )
}
