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
  Save,
  Loader2,
  Play,
  Pause,
  XCircle,
  Archive,
  RefreshCw,
  ExternalLink,
  X,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  CONTRACT_LABELS,
  EXPERIENCE_LABELS,
  StatusBadge,
} from '@/lib/status-labels'
import { apiFetch } from '@/lib/api-client'
import type { AdminJob, AdminCompany } from '@/lib/types'

const CONTRACT_OPTIONS = Object.entries(CONTRACT_LABELS)
const EXPERIENCE_OPTIONS = Object.entries(EXPERIENCE_LABELS)
const CATEGORY_OPTIONS = ['Ingénierie', 'Énergie', 'Design', 'Développement', 'Maintenance', 'Stage']

function parseSkills(skills: string): string[] {
  try {
    const v = JSON.parse(skills)
    if (Array.isArray(v)) return v
  } catch {
    return []
  }
  return []
}

export function JobDetail({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [acting, setActing] = React.useState<string | null>(null)
  const [job, setJob] = React.useState<AdminJob | null>(null)
  const [companies, setCompanies] = React.useState<AdminCompany[]>([])
  const [skills, setSkills] = React.useState<string[]>([])
  const [skillInput, setSkillInput] = React.useState('')

  // Form fields
  const [title, setTitle] = React.useState('')
  const [companyId, setCompanyId] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [country, setCountry] = React.useState('France')
  const [contractType, setContractType] = React.useState('')
  const [experienceLevel, setExperienceLevel] = React.useState('')
  const [salaryText, setSalaryText] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [applicationDeadline, setApplicationDeadline] = React.useState('')
  const [isFeatured, setIsFeatured] = React.useState(false)
  const [seoTitle, setSeoTitle] = React.useState('')
  const [seoDescription, setSeoDescription] = React.useState('')

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const [jobRes, compRes] = await Promise.all([
      apiFetch<AdminJob>(`/api/admin/jobs/${id}`),
      apiFetch<{ items: AdminCompany[] }>('/api/admin/companies?pageSize=200'),
    ])
    if (jobRes.ok && jobRes.data) {
      const j = jobRes.data
      setJob(j)
      setTitle(j.title)
      setCompanyId(j.companyId)
      setDescription(j.description)
      setLocation(j.location ?? '')
      setCountry(j.country ?? 'France')
      setContractType(j.contractType ?? '')
      setExperienceLevel(j.experienceLevel ?? '')
      setSalaryText(j.salaryText ?? '')
      setCategory(j.category ?? '')
      setApplicationDeadline(j.applicationDeadline ? j.applicationDeadline.slice(0, 10) : '')
      setIsFeatured(j.isFeatured)
      setSeoTitle(j.seoTitle ?? '')
      setSeoDescription(j.seoDescription ?? '')
      setSkills(parseSkills(j.skills))
    } else {
      toast.error(jobRes.message)
    }
    if (compRes.ok) setCompanies(compRes.data.items)
    setLoading(false)
  }, [id])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const save = async () => {
    setSubmitting(true)
    const res = await apiFetch(`/api/admin/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        companyId,
        description,
        location,
        country,
        contractType,
        experienceLevel,
        salaryText,
        skills,
        category,
        applicationDeadline,
        isFeatured,
        seoTitle,
        seoDescription,
      }),
    })
    setSubmitting(false)
    if (res.ok) {
      toast.success('Modifications enregistrées.')
      fetchData()
    } else {
      toast.error(res.message)
    }
  }

  const setStatus = async (status: string) => {
    setActing(status)
    const res = await apiFetch(`/api/admin/jobs/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setActing(null)
    if (res.ok) {
      toast.success(`Statut changé : ${status}`)
      fetchData()
    } else {
      toast.error(res.message)
    }
  }

  const archive = async () => {
    setActing('ARCHIVE')
    const res = await apiFetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
    setActing(null)
    if (res.ok) {
      toast.success('Offre archivée.')
      router.push('/admin/offres')
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

  if (!job) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Offre introuvable.
        </CardContent>
      </Card>
    )
  }

  const addSkill = () => {
    const v = skillInput.trim()
    if (!v || skills.includes(v) || skills.length >= 20) return
    setSkills([...skills, v])
    setSkillInput('')
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 gap-1.5">
          <Link href="/admin/offres">
            <ArrowLeft className="size-4" />
            Retour aux offres
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={job.status} kind="job" />
              <span className="font-mono text-xs text-muted-foreground">{job.publicReference}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold">{job.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.company?.legalName ?? '—'}
              {job.publishedAt && (
                <> · publiée le {format(new Date(job.publishedAt), 'dd MMM yyyy', { locale: fr })}</>
              )}
            </p>
          </div>

          {/* STATUS ACTIONS */}
          <div className="flex flex-wrap gap-2">
            {job.status !== 'PUBLISHED' && (
              <Button onClick={() => setStatus('PUBLISHED')} disabled={acting !== null} variant="default" className="gap-1.5">
                <Play className="size-4" />
                Publier
              </Button>
            )}
            {job.status === 'PUBLISHED' && (
              <Button onClick={() => setStatus('PAUSED')} disabled={acting !== null} variant="outline" className="gap-1.5">
                <Pause className="size-4" />
                Mettre en pause
              </Button>
            )}
            <Button onClick={() => setStatus('CLOSED')} disabled={acting !== null} variant="outline" className="gap-1.5">
              <XCircle className="size-4" />
              Clore
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={acting !== null} className="gap-1.5">
                  {acting === 'ARCHIVE' ? <Loader2 className="size-4 animate-spin" /> : <Archive className="size-4" />}
                  Archiver
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archiver cette offre ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    L’offre sera masquée du site public. Les candidatures existantes
                    sont conservées et l’archive reste consultable dans l’administration.
                    Cette action est réversible (vous pourrez republier l’offre).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={archive}>Confirmer l’archivage</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {job.status === 'PUBLISHED' && (
              <Button asChild variant="ghost" size="icon" aria-label="Voir sur le site public">
                <a href={`/offres/${job.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* EDIT FORM */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Modifier l’offre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Titre du poste *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Entreprise *</Label>
              <Select value={companyId || '__all__'} onValueChange={(v) => setCompanyId(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">—</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.legalName}
                      {c.city ? ` · ${c.city}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Localisation</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Pays</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select value={category || '__all__'} onValueChange={(v) => setCategory(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">—</SelectItem>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Type de contrat</Label>
              <Select value={contractType || '__all__'} onValueChange={(v) => setContractType(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">—</SelectItem>
                  {CONTRACT_OPTIONS.map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Niveau d’expérience</Label>
              <Select value={experienceLevel || '__all__'} onValueChange={(v) => setExperienceLevel(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">—</SelectItem>
                  {EXPERIENCE_OPTIONS.map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Salaire</Label>
              <Input value={salaryText} onChange={(e) => setSalaryText(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Date limite de candidature</Label>
              <Input type="date" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={10} />
          </div>

          <div className="space-y-1.5">
            <Label>Compétences</Label>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} aria-label={`Retirer ${s}`}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    addSkill()
                  }
                }}
                placeholder="Tapez une compétence puis Entrée"
              />
              <Button type="button" variant="outline" onClick={addSkill} className="gap-1.5">
                <Plus className="size-4" />
                Ajouter
              </Button>
            </div>
          </div>

          <label htmlFor="isFeatured" className="flex items-start gap-3 text-sm">
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(v) => setIsFeatured(v === true)}
            />
            <span>
              <span className="font-medium">Mettre à la une</span>
              <br />
              <span className="text-xs text-muted-foreground">
                L’offre sera mise en avant sur la page d’accueil.
              </span>
            </span>
          </label>

          <Separator />

          <div className="space-y-1.5">
            <Label>Titre SEO</Label>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Description SEO</Label>
            <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} />
          </div>

          <div className="flex gap-3">
            <Button onClick={save} disabled={submitting} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Enregistrer
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={fetchData} className="gap-1.5">
              <RefreshCw className="size-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CANDIDATURES */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Candidatures liées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {job._count?.applications ?? 0} candidature(s) reçue(s) pour cette offre.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/candidatures?jobId=${job.id}`}>
                Voir les candidatures
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
