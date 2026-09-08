'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { ArrowRight, RefreshCw } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge, APPLICATION_LABELS } from '@/lib/status-labels'
import { apiFetch } from '@/lib/api-client'
import type { AdminApplication } from '@/lib/types'

const STATUS_OPTIONS = Object.entries(APPLICATION_LABELS)

export function ApplicationsList({ initialData }: { initialData?: { items: AdminApplication[]; total: number; totalPages: number } | null }) {
  const router = useRouter()
  const params = useSearchParams()

  const [status, setStatus] = React.useState(params.get('status') ?? '__all__')
  const [search, setSearch] = React.useState(params.get('search') ?? '')
  const [jobId] = React.useState(params.get('jobId') ?? '')
  const [loading, setLoading] = React.useState(!initialData)
  const [data, setData] = React.useState<{ items: AdminApplication[]; total: number; totalPages: number }>({
    items: initialData?.items ?? [],
    total: initialData?.total ?? 0,
    totalPages: initialData?.totalPages ?? 1,
  })
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const sp = new URLSearchParams()
    if (status !== '__all__') sp.set('status', status)
    if (search.trim()) sp.set('search', search.trim())
    if (jobId) sp.set('jobId', jobId)
    sp.set('page', String(page))
    const result = await apiFetch<{ items: AdminApplication[]; total: number; totalPages: number }>(
      `/api/admin/applications?${sp.toString()}`,
    )
    if (result.ok) {
      setData({
        items: result.data.items,
        total: result.data.total,
        totalPages: result.data.totalPages,
      })
    } else {
      toast.error(result.message)
    }
    setLoading(false)
  }, [status, search, jobId, page])

  React.useEffect(() => {
    // Skip initial fetch if server already pre-fetched the data.
    if (initialData) return
    fetchData()
     
  }, [fetchData])

  const updateUrl = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(updates)) {
      if (!v) next.delete(k)
      else next.set(k, v)
    }
    router.replace(`/admin/candidatures?${next.toString()}`)
  }

  return (
    <div className="space-y-6">
      {jobId && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
          <p>
            Filtré par offre.{' '}
            <Link href={`/admin/offres/${jobId}`} className="font-medium text-primary hover:underline">
              Voir l’offre →
            </Link>
            <span className="ml-3">
              <Link href="/admin/candidatures" className="text-xs text-muted-foreground hover:underline">
                Retirer le filtre
              </Link>
            </span>
          </p>
        </div>
      )}

      <Card>
        <CardContent className="grid gap-3 py-4 sm:grid-cols-[1fr_220px_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="search-input" className="sr-only">Recherche</Label>
            <Input
              id="search-input"
              placeholder="Rechercher par candidat, e-mail, référence…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  updateUrl({ search: search.trim() || null, page: null })
                }
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v)
              updateUrl({ status: v === '__all__' ? null : v, page: null })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous les statuts</SelectItem>
              {STATUS_OPTIONS.map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setStatus('__all__')
                router.replace('/admin/candidatures')
              }}
            >
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
              Aucune candidature trouvée.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Candidat</TableHead>
                  <TableHead className="hidden lg:table-cell">Offre</TableHead>
                  <TableHead className="hidden md:table-cell">Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">
                      <Link href={`/admin/candidatures/${a.id}`} className="hover:underline">
                        {a.publicReference}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/admin/candidatures/${a.id}`} className="hover:underline">
                        {a.candidateName}
                      </Link>
                      <br />
                      <span className="text-xs text-muted-foreground">{a.candidateEmail}</span>
                    </TableCell>
                    <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground lg:table-cell">
                      {a.job?.title ?? '—'}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {a.job?.company?.legalName ?? '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} kind="application" />
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {format(new Date(a.submittedAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="icon" variant="ghost" className="size-8" aria-label="Voir le détail">
                        <Link href={`/admin/candidatures/${a.id}`}>
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        {data.total} candidature{data.total > 1 ? 's' : ''} · Page {page} / {data.totalPages}
      </p>
    </div>
  )
}
