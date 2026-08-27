'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { apiFetch } from '@/lib/api-client'
import type { AdminCompany } from '@/lib/types'

export function CompaniesTable() {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<{ items: AdminCompany[]; total: number }>({
    items: [],
    total: 0,
  })

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const sp = new URLSearchParams()
    if (search.trim()) sp.set('search', search.trim())
    const result = await apiFetch<{ items: AdminCompany[]; total: number }>(
      `/api/admin/companies?${sp.toString()}`,
    )
    if (result.ok) {
      setData({ items: result.data.items, total: result.data.total })
    } else {
      toast.error(result.message)
    }
    setLoading(false)
  }, [search])

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="search-input" className="sr-only">Recherche</Label>
            <Input
              id="search-input"
              placeholder="Rechercher par nom, e-mail, référence…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  fetchData()
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setSearch(''); fetchData() }}>
              Réinitialiser
            </Button>
            <Button onClick={() => fetchData()} variant="ghost" size="icon" aria-label="Rafraîchir">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Aucune entreprise trouvée.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Secteur</TableHead>
                  <TableHead className="hidden md:table-cell">Ville</TableHead>
                  <TableHead className="text-center">Comptes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{c.publicReference}</TableCell>
                    <TableCell>
                      <p className="font-medium">{c.legalName}</p>
                      {c.tradeName && (
                        <p className="text-xs text-muted-foreground">{c.tradeName}</p>
                      )}
                      {c.isVerified && (
                        <Badge variant="outline" className="mt-1 bg-emerald-50 font-normal text-emerald-700">
                          Vérifiée
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {c.email}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {c.sector ?? '—'}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {c.city ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center justify-center gap-1 text-xs">
                        <span className="inline-flex items-center rounded-full bg-secondary px-1.5 py-0.5 text-secondary-foreground">
                          {c._count?.jobs ?? 0} offre{(c._count?.jobs ?? 0) > 1 ? 's' : ''}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-900">
                          {c._count?.applications ?? 0} cand.
                        </span>
                        <span className="inline-flex items-center rounded-full bg-sky-100 px-1.5 py-0.5 text-sky-900">
                          {c._count?.submissions ?? 0} sou.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        {data.total} entreprise{data.total > 1 ? 's' : ''} enregistrée{data.total > 1 ? 's' : ''}
      </p>
    </div>
  )
}
