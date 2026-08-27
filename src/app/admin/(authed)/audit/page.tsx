import { requireAdminRole } from '@/lib/auth'
import { AuditTable } from '@/components/admin/audit-table'

export default async function AdminAuditPage() {
  await requireAdminRole('ADMIN')
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Journal d’audit
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Traçabilité complète des actions sensibles effectuées sur la plateforme.
        </p>
      </header>

      <AuditTable />
    </div>
  )
}
