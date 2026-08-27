'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FilePlus2,
  Loader2,
  MessageSquareWarning,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  CONTRACT_LABELS,
  EXPERIENCE_LABELS,
  StatusBadge,
} from '@/lib/status-labels'
import { apiFetch } from '@/lib/api-client'
import type { AdminSubmission } from '@/lib/types'

function parseSkills(skills: string | string[] | undefined): string[] {
  if (!skills) return []
  if (Array.isArray(skills)) return skills
  try {
    const v = JSON.parse(skills)
    if (Array.isArray(v)) return v
  } catch {
    return []
  }
  return []
}

export function SubmissionDetail({ id }: { id: string }) {
  const router = useRouter()
  const [data, setData] = React.useState<AdminSubmission | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [acting, setActing] = React.useState<string | null>(null)
  const [correctionMsg, setCorrectionMsg] = React.useState('')
  const [correctionOpen, setCorrectionOpen] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const res = await apiFetch<AdminSubmission>(`/api/admin/job-submissions/${id}`)
    if (res.ok) setData(res.data)
    else toast.error(res.message)
    setLoading(false)
  }, [id])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const act = async (
    status: 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION' | 'CONVERTED_TO_JOB',
    extra?: { correctionMessage?: string },
  ) => {
    setActing(status)
    const res = await apiFetch(`/api/admin/job-submissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra }),
    })
    setActing(null)
    if (res.ok) {
      const msg =
        status === 'APPROVED'
          ? 'Soumission approuvée.'
          : status === 'REJECTED'
          ? 'Soumission rejetée.'
          : status === 'NEEDS_CORRECTION'
          ? 'Correction demandée.'
          : 'Offre créée depuis la soumission.'
      toast.success(msg)
      if (status === 'CONVERTED_TO_JOB') {
        const jobId = (res.data as { job?: { id: string } })?.job?.id
        if (jobId) router.push(`/admin/offres/${jobId}`)
        else router.push('/admin/offres')
        router.refresh()
      } else {
        fetchData()
        if (status === 'NEEDS_CORRECTION') setCorrectionOpen(false)
      }
    } else {
      toast.error(res.message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader />
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Soumission introuvable.
        </CardContent>
      </Card>
    )
  }

  const skills = parseSkills(data.requiredSkills)
  const canAct = data.status === 'PENDING_REVIEW' || data.status === 'NEEDS_CORRECTION'

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 gap-1.5">
          <Link href="/admin/soumissions">
            <ArrowLeft className="size-4" />
            Retour aux soumissions
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={data.status} kind="submission" />
              <span className="font-mono text-xs text-muted-foreground">
                {data.publicReference}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold">{data.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Soumise le {data.submittedAt && format(new Date(data.submittedAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
          {canAct && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => act('APPROVED')}
                disabled={acting !== null}
                variant="outline"
                className="gap-1.5 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                {acting === 'APPROVED' ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Approuver
              </Button>
              <Dialog open={correctionOpen} onOpenChange={setCorrectionOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1.5 border-amber-600 text-amber-700 hover:bg-amber-50">
                    <MessageSquareWarning className="size-4" />
                    Demander correction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Demander une correction</DialogTitle>
                    <DialogDescription>
                      Le message sera envoyé par e-mail au contact entreprise.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-1.5">
                    <Label htmlFor="correction-message">Message</Label>
                    <Textarea
                      id="correction-message"
                      rows={5}
                      value={correctionMsg}
                      onChange={(e) => setCorrectionMsg(e.target.value)}
                      placeholder="Précisez les corrections attendues…"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Annuler</Button>
                    </DialogClose>
                    <Button
                      onClick={() => act('NEEDS_CORRECTION', { correctionMessage: correctionMsg })}
                      disabled={acting !== null || !correctionMsg.trim()}
                    >
                      {acting === 'NEEDS_CORRECTION' && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Envoyer la demande
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                onClick={() => act('REJECTED')}
                disabled={acting !== null}
                variant="outline"
                className="gap-1.5 border-red-600 text-red-700 hover:bg-red-50"
              >
                {acting === 'REJECTED' ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                Rejeter
              </Button>
              <Button
                onClick={() => act('CONVERTED_TO_JOB')}
                disabled={acting !== null}
                variant="default"
                className="gap-1.5"
              >
                {acting === 'CONVERTED_TO_JOB' ? <Loader2 className="size-4 animate-spin" /> : <FilePlus2 className="size-4" />}
                Convertir en offre
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* MAIN CONTENT */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {data.description}
              </div>
            </CardContent>
          </Card>

          {skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Compétences requises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.correctionMessage && (
            <Card className="border-amber-300 bg-amber-50">
              <CardHeader>
                <CardTitle className="font-serif text-base text-amber-900">
                  Message de correction envoyé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-amber-900">
                  {data.correctionMessage}
                </p>
              </CardContent>
            </Card>
          )}

          {data.job && (
            <Card className="border-emerald-300 bg-emerald-50">
              <CardContent className="py-4">
                <p className="text-sm font-medium text-emerald-900">
                  Offre créée à partir de cette soumission :
                </p>
                <Link
                  href={`/admin/offres/${data.job.id}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline"
                >
                  {data.job.title} · {data.job.publicReference}
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Localisation</dt>
                  <dd className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    {data.location || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Type de contrat</dt>
                  <dd>{data.contractType ? (CONTRACT_LABELS[data.contractType] ?? data.contractType) : '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Niveau d’expérience</dt>
                  <dd>{data.experienceLevel ? (EXPERIENCE_LABELS[data.experienceLevel] ?? data.experienceLevel) : '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Salaire</dt>
                  <dd>{data.salaryText || '—'}</dd>
                </div>
                {data.deadline && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Date limite</dt>
                    <dd>{format(new Date(data.deadline), 'dd MMMM yyyy', { locale: fr })}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">Contact entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                {data.company?.legalName ?? 'Nouvelle entreprise'}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <a href={`mailto:${data.contactEmail}`} className="hover:underline">
                  {data.contactEmail}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">{data.contactName}</span>
              </p>
              {data.contactPhone && (
                <p className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  {data.contactPhone}
                </p>
              )}
              {data.company?.website && (
                <p className="flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  <a href={data.company.website} target="_blank" rel="noreferrer" className="hover:underline">
                    {data.company.website}
                  </a>
                </p>
              )}
              {data.reviewer && (
                <>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    Revue par {data.reviewer.fullName}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Button variant="ghost" size="sm" className="w-full gap-1.5" onClick={fetchData}>
            <RefreshCw className="size-4" />
            Rafraîchir
          </Button>
        </aside>
      </div>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </>
  )
}
