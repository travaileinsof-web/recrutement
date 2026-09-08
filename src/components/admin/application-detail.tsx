'use client'

import * as React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Loader2,
  RefreshCw,
  Send,
  Plus,
  MessageSquare,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  APPLICATION_LABELS,
  StatusBadge,
} from '@/lib/status-labels'
import { apiFetch } from '@/lib/api-client'
import type { AdminApplication } from '@/lib/types'

const STATUS_OPTIONS = Object.entries(APPLICATION_LABELS)

export function ApplicationDetail({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<AdminApplication | null>(null)
  const [note, setNote] = React.useState('')
  const [savingNote, setSavingNote] = React.useState(false)
  const [newStatus, setNewStatus] = React.useState('')
  const [publicMessage, setPublicMessage] = React.useState('')
  const [internalNote, setInternalNote] = React.useState('')
  const [savingStatus, setSavingStatus] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const res = await apiFetch<AdminApplication>(`/api/admin/applications/${id}`)
    if (res.ok) {
      setData(res.data)
      setNewStatus(res.data.status)
    } else {
      toast.error(res.message)
    }
    setLoading(false)
  }, [id])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const addNote = async () => {
    if (!note.trim()) return
    setSavingNote(true)
    const res = await apiFetch(`/api/admin/applications/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
    setSavingNote(false)
    if (res.ok) {
      toast.success('Note ajoutée.')
      setNote('')
      fetchData()
    } else {
      toast.error(res.message)
    }
  }

  const changeStatus = async () => {
    if (!newStatus) return
    setSavingStatus(true)
    const res = await apiFetch(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        publicMessage: publicMessage.trim() || undefined,
        internalNote: internalNote.trim() || undefined,
      }),
    })
    setSavingStatus(false)
    if (res.ok) {
      toast.success('Statut mis à jour.')
      setPublicMessage('')
      setInternalNote('')
      fetchData()
    } else {
      toast.error(res.message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="size-8 w-1/3 animate-pulse rounded bg-muted" />
        <div className="size-4 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Candidature introuvable.
        </CardContent>
      </Card>
    )
  }

  const cvFiles = data.files.filter((f) => f.kind === 'CV')
  const coverFiles = data.files.filter((f) => f.kind === 'COVER_LETTER')

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 gap-1.5">
          <Link href="/admin/candidatures">
            <ArrowLeft className="size-4" />
            Retour aux candidatures
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={data.status} kind="application" />
              <span className="font-mono text-xs text-muted-foreground">{data.publicReference}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold">{data.candidateName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.job?.title} · {data.job?.company.legalName}
              <br />
              Soumise le {format(new Date(data.submittedAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
          <Button variant="ghost" onClick={fetchData} className="gap-1.5" size="sm">
            <RefreshCw className="size-4" />
            Rafraîchir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* CANDIDATE INFO */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Coordonnées du candidat</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Nom</p>
                <p className="font-medium">{data.candidateName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">E-mail</p>
                <a href={`mailto:${data.candidateEmail}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  <Mail className="size-3.5" />
                  {data.candidateEmail}
                </a>
              </div>
              {data.candidatePhone && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Téléphone</p>
                  <p className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground" />
                    {data.candidatePhone}
                  </p>
                </div>
              )}
              {data.candidateCity && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Ville</p>
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground" />
                    {data.candidateCity}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* COVER LETTER */}
          {data.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <FileText className="size-4 text-accent" />
                  Lettre de motivation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {data.coverLetter}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FILES */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Fichiers joints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FileList label="CV" files={cvFiles} appId={data.id} />
              <FileList label="Lettre de motivation (fichier)" files={coverFiles} appId={data.id} />
            </CardContent>
          </Card>

          {/* STATUS HISTORY */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Historique des statuts</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {data.statusHistory.map((h, i) => {
                  const date = new Date(h.createdAt)
                  const isNote = h.fromStatus === h.toStatus && h.internalNote
                  return (
                    <li key={h.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className={`mt-1.5 size-2.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                        {i < data.statusHistory.length - 1 && (
                          <span className="mt-1 h-8 w-px bg-border" aria-hidden />
                        )}
                      </div>
                      <div className="pb-2">
                        {isNote ? (
                          <>
                            <p className="text-xs text-muted-foreground">
                              Note interne · {format(date, "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                              {h.changedBy && ` · ${h.changedBy.fullName}`}
                            </p>
                            <p className="mt-1 text-sm text-foreground/80">{h.internalNote}</p>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-2">
                              {h.fromStatus && <StatusBadge status={h.fromStatus} kind="application" />}
                              <span className="text-xs text-muted-foreground">→</span>
                              <StatusBadge status={h.toStatus} kind="application" />
                              <span className="text-xs text-muted-foreground">
                                {format(date, "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                {h.changedBy && ` · ${h.changedBy.fullName}`}
                              </span>
                            </div>
                            {h.publicMessage && (
                              <p className="mt-1 flex items-start gap-1.5 text-sm text-foreground/80">
                                <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={1.75} />
                                <span>{h.publicMessage}</span>
                              </p>
                            )}
                            {h.internalNote && (
                              <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                                <Lock className="mt-0.5 size-3 shrink-0" strokeWidth={2} />
                                <span>Note interne : {h.internalNote}</span>
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* JOB CONTEXT */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">Offre visée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{data.job?.title}</p>
              <p className="text-muted-foreground">{data.job?.company.legalName}</p>
              <p className="font-mono text-xs text-muted-foreground">{data.job?.publicReference}</p>
              {data.job && (
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href={`/admin/offres/${data.job.id}`}>
                    Voir l’offre
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* ADD NOTE */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">Ajouter une note interne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Visible uniquement par les administrateurs…"
              />
              <Button onClick={addNote} disabled={savingNote || !note.trim()} className="w-full gap-1.5" size="sm">
                {savingNote ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Ajouter la note
              </Button>
            </CardContent>
          </Card>

          {/* CHANGE STATUS */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">Changer le statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="newStatus">Nouveau statut</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="publicMessage">Message public (optionnel)</Label>
                <Textarea
                  id="publicMessage"
                  rows={3}
                  value={publicMessage}
                  onChange={(e) => setPublicMessage(e.target.value)}
                  placeholder="Visible par le candidat dans son suivi…"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="internalNote">Note interne (optionnel)</Label>
                <Input
                  id="internalNote"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Contexte interne…"
                />
              </div>
              <Button onClick={changeStatus} disabled={savingStatus || !newStatus} className="w-full gap-1.5" size="sm">
                {savingStatus ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Appliquer
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function FileList({
  label,
  files,
  appId,
}: {
  label: string
  files: Array<{ id: string; originalName: string; sizeBytes: number; mimeType: string; createdAt: string }>
  appId: string
}) {
  if (files.length === 0) {
    return (
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">Aucun fichier.</p>
      </div>
    )
  }
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <ul className="space-y-2">
        {files.map((f) => (
          <li
            key={f.id}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{f.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {(f.sizeBytes / 1024).toFixed(1)} Ko · {f.mimeType}
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <a href={`/api/admin/applications/${appId}/files/${f.id}`} target="_blank" rel="noreferrer">
                <Download className="size-3.5" />
                Télécharger
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
