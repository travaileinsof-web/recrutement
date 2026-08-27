'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { RefreshCw, ScrollText } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { apiFetch } from '@/lib/api-client'

interface AuditEntry {
  id: string
  action: string
  entityType: string
  entityId: string | null
  actorAdminId: string | null
  actor: { fullName: string; email: string } | null
  beforeData: string | null
  afterData: string | null
  ipHash: string | null
  userAgent: string | null
  createdAt: string
}

export function AuditTable() {
  const [actor, setActor] = React.useState('')
  const [action, setAction] = React.useState('')
  const [entityType, setEntityType] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<AuditEntry[]>([])

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const sp = new URLSearchParams()
    if (actor.trim()) sp.set('actor', actor.trim())
    if (action.trim()) sp.set('action', action.trim())
    if (entityType.trim()) sp.set('entityType', entityType.trim())
    const result = await apiFetch<{ items: AuditEntry[]; total: number }>(
      `/api/admin/audit-logs?${sp.toString()}`,
    )
    if (result.ok) {
      setItems(result.data.items)
    } else {
      toast.error(result.message)
    }
    setLoading(false)
  }, [actor, action, entityType])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="size-4" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="filter-actor" className="text-xs">Acteur (ID admin)</Label>
            <Input
              id="filter-actor"
              placeholder="cuid…"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-action" className="text-xs">Action</Label>
            <Input
              id="filter-action"
              placeholder="JOB_CREATE, APPLICATION_STATUS_CHANGE…"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-entity" className="text-xs">Type d’entité</Label>
            <Input
              id="filter-entity"
              placeholder="Job, Application, JobSubmission…"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={fetchData}>Filtrer</Button>
            <Button variant="ghost" size="icon" onClick={fetchData} aria-label="Rafraîchir">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Aucune entrée d’audit pour ces filtres.
            </p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto scroll-pretty">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead className="w-44">Date</TableHead>
                    <TableHead>Acteur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Entité</TableHead>
                    <TableHead className="hidden lg:table-cell">IP (hash)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((e) => (
                    <TableRow key={e.id} className="hover:bg-muted/50">
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {format(new Date(e.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {e.actor ? (
                          <div>
                            <p className="font-medium">{e.actor.fullName}</p>
                            <p className="text-xs text-muted-foreground">{e.actor.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Système</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                          {e.action}
                        </code>
                      </TableCell>
                      <TableCell className="hidden text-xs md:table-cell">
                        {e.entityType}
                        {e.entityId && (
                          <p className="text-muted-foreground">{e.entityId.slice(0, 8)}…</p>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                        {e.ipHash ? `${e.ipHash.slice(0, 12)}…` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Le journal d’audit est append-only. Aucune entrée ne peut être modifiée ou supprimée depuis cette
        interface. Chaque transition sensible (statut d’offre, statut de candidature, approbation de
        soumission) y est enregistrée avec l’acteur, la date et un hash d’IP.
      </p>
    </div>
  )
}
