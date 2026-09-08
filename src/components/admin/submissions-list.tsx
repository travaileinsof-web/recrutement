'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { Check, X, ArrowRight, Loader2, RefreshCw } from 'lucide-react'
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
import { StatusBadge, SUBMISSION_LABELS } from '@/lib/status-labels'
import { apiFetch } from '@/lib/api-client'
import type { AdminSubmission } from '@/lib/types'

const STATUS_OPTIONS = Object.entries(SUBMISSION_LABELS)

export function SubmissionsList({ initialData }: { initialData?: { items: AdminSubmission[]; total: number; totalPages: number } | null }) {
  const router = useRouter()
  const params = useSearchParams()

  const [status, setStatus] = React.useState(params.get('status') ?? '__all__')
  const [search, setSearch] = React.useState(params.get('search') ?? '')
  const [loading, setLoading] = React.useState(!initialData)
  const [data, setData] = React.useState<{ items: AdminSubmission[]; total: number; totalPages: number }>({
    items: initialData?.items ?? [],
    total: initialData?.total ?? 0,
    totalPages: initialData?.totalPages ?? 1,
  })
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)
  const [actingId, setActingId] = React.useState<string | null>(null)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const sp = new URLSearchParams()
    if (status !== '__all__') sp.set('status', status)
    if (search.trim()) sp.set('search', search.trim())
    sp.set('page', String(page))
    const result = await apiFetch<{ items: AdminSubmission[]; total: number; totalPages: number }>(
      `/api/admin/job-submissions?${sp.toString()}`,
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
    router.replace(`/admin/soumissions?${next.toString()}`)
  }

  const quickAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setActingId(id)
    const res = await apiFetch(`/api/admin/job-submissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action }),
    })
    setActingId(null)
    if (res.ok) {
      toast.success(action === 'APPROVED' ? 'Soumission approuvée.' : 'Soumission rejetée.')
      fetchData()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-3 py-4 sm:grid-cols-[1fr_220px_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="search-input" className="sr-only">Recherche</Label>
            <Input
              id="search-input"
              placeholder="Rechercher par titre, référence, contact…"
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
                router.replace('/admin/soumissions')
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
              Aucune soumission trouvée.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">
                      <Link href={`/admin/soumissions/${s.id}`} className="hover:underline">
                        {s.publicReference}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate font-medium">
                      <Link href={`/admin/soumissions/${s.id}`} className="hover:underline">
                        {s.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {s.contactName}
                      <br />
                      <span className="text-xs">{s.contactEmail}</span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {s.company?.legalName ?? '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} kind="submission" />
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {s.submittedAt
                        ? format(new Date(s.submittedAt), 'dd/MM/yyyy')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {s.status === 'PENDING_REVIEW' && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700"
                              aria-label="Approuver"
                              disabled={actingId === s.id}
                              onClick={(e) => {
                                e.preventDefault()
                                quickAction(s.id, 'APPROVED')
                              }}
                            >
                              {actingId === s.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Check className="size-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-red-700 hover:bg-red-100 hover:text-red-700"
                              aria-label="Rejeter"
                              disabled={actingId === s.id}
                              onClick={(e) => {
                                e.preventDefault()
                                quickAction(s.id, 'REJECTED')
                              }}
                            >
                              <X className="size-4" />
                            </Button>
                          </>
                        )}
                        <Button asChild size="icon" variant="ghost" className="size-8">
                          <Link href={`/admin/soumissions/${s.id}`} aria-label="Voir le détail">
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
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
        {data.total} soumission{data.total > 1 ? 's' : ''} · Page {page} / {data.totalPages}
      </p>
    </div>
  )
}
