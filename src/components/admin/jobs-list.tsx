'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { Plus, ArrowRight, RefreshCw } from 'lucide-react'
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
import { StatusBadge, JOB_LABELS } from '@/lib/status-labels'
import { apiFetch } from '@/lib/api-client'
import type { AdminJob } from '@/lib/types'

const STATUS_OPTIONS = Object.entries(JOB_LABELS)

export function JobsList() {
  const router = useRouter()
  const params = useSearchParams()

  const [status, setStatus] = React.useState(params.get('status') ?? '__all__')
  const [search, setSearch] = React.useState(params.get('search') ?? '')
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<{ items: AdminJob[]; total: number; totalPages: number }>({
    items: [],
    total: 0,
    totalPages: 1,
  })
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const sp = new URLSearchParams()
    if (status !== '__all__') sp.set('status', status)
    if (search.trim()) sp.set('search', search.trim())
    sp.set('page', String(page))
    const result = await apiFetch<{ items: AdminJob[]; total: number; totalPages: number }>(
      `/api/admin/jobs?${sp.toString()}`,
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
  }, [status, search, page])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateUrl = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(updates)) {
      if (!v) next.delete(k)
      else next.set(k, v)
    }
    router.replace(`/admin/offres?${next.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Button asChild>
          <Link href="/admin/offres/nouvelle">
            <Plus className="size-4" />
            Créer une offre
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-3 py-4 sm:grid-cols-[1fr_220px_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="search-input" className="sr-only">Recherche</Label>
            <Input
              id="search-input"
              placeholder="Rechercher par titre ou référence…"
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
                router.replace('/admin/offres')
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
              Aucune offre trouvée.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="hidden lg:table-cell">Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-center">Candidatures</TableHead>
                  <TableHead className="hidden md:table-cell">Publication</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((job) => (
                  <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">
                      <Link href={`/admin/offres/${job.id}`} className="hover:underline">
                        {job.publicReference}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate font-medium">
                      <Link href={`/admin/offres/${job.id}`} className="hover:underline">
                        {job.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {job.company?.legalName ?? '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} kind="job" />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {job._count?.applications ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {job.publishedAt ? format(new Date(job.publishedAt), 'dd/MM/yyyy') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="icon" variant="ghost" className="size-8" aria-label="Voir le détail">
                        <Link href={`/admin/offres/${job.id}`}>
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
        {data.total} offre{data.total > 1 ? 's' : ''} · Page {page} / {data.totalPages}
      </p>
    </div>
  )
}
