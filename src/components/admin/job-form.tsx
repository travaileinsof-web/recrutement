'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Save, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminJobSchema } from '@/lib/validation'
import { CONTRACT_LABELS, EXPERIENCE_LABELS } from '@/lib/status-labels'
import { apiFetch } from '@/lib/api-client'
import type { AdminCompany } from '@/lib/types'

type FormValues = {
  title: string
  companyId: string
  description: string
  location?: string
  country?: string
  contractType?: string
  experienceLevel?: string
  salaryText?: string
  skills: string[]
  category?: string
  applicationDeadline?: string
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
}

const CONTRACT_OPTIONS = Object.entries(CONTRACT_LABELS)
const EXPERIENCE_OPTIONS = Object.entries(EXPERIENCE_LABELS)
const CATEGORY_OPTIONS = ['Ingénierie', 'Énergie', 'Design', 'Développement', 'Maintenance', 'Stage']

export function JobForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)
  const [companies, setCompanies] = React.useState<AdminCompany[]>([])
  const [skills, setSkills] = React.useState<string[]>([])
  const [skillInput, setSkillInput] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(AdminJobSchema),
    defaultValues: {
      title: '',
      companyId: '',
      description: '',
      location: '',
      country: 'France',
      contractType: '',
      experienceLevel: '',
      salaryText: '',
      skills: [],
      category: '',
      applicationDeadline: '',
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
    },
  })

  React.useEffect(() => {
    apiFetch<{ items: AdminCompany[] }>('/api/admin/companies?pageSize=100').then((r) => {
      if (r.ok) setCompanies(r.data.items)
    })
  }, [])

  const companyId = watch('companyId')
  const contractType = watch('contractType')
  const experienceLevel = watch('experienceLevel')
  const category = watch('category')
  const isFeatured = watch('isFeatured')

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const payload = { ...values, skills }
    const res = await apiFetch<{ id: string }>('/api/admin/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSubmitting(false)
    if (res.ok) {
      toast.success('Offre créée. Vous pouvez maintenant la publier.')
      router.push(`/admin/offres/${res.data.id}`)
      router.refresh()
    } else {
      toast.error(res.message)
      if (res.issues && Array.isArray(res.issues)) {
        const first = (res.issues as Array<{ path?: string; message?: string }>)[0]
        if (first) toast.error(`${first.path ?? ''}: ${first.message ?? ''}`)
      }
    }
  })

  const addSkill = () => {
    const v = skillInput.trim()
    if (!v || skills.includes(v) || skills.length >= 20) return
    setSkills([...skills, v])
    setSkillInput('')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Informations principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Titre du poste *</Label>
              <Input
                {...register('title')}
                placeholder="Ingénieur·e Robotique Senior"
                aria-invalid={!!errors.title}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Entreprise *</Label>
              <Select
                value={companyId || '__all__'}
                onValueChange={(v) => setValue('companyId', v === '__all__' ? '' : v, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une entreprise…" />
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
              {errors.companyId && <p className="text-xs text-destructive">{errors.companyId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Localisation</Label>
              <Input {...register('location')} placeholder="Paris (75) — hybride" />
            </div>

            <div className="space-y-1.5">
              <Label>Pays</Label>
              <Input {...register('country')} defaultValue="France" />
            </div>

            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select
                value={category || '__all__'}
                onValueChange={(v) => setValue('category', v === '__all__' ? '' : v, { shouldValidate: true })}
              >
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
              <Select
                value={contractType || '__all__'}
                onValueChange={(v) => setValue('contractType', v === '__all__' ? '' : v, { shouldValidate: true })}
              >
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
              <Select
                value={experienceLevel || '__all__'}
                onValueChange={(v) => setValue('experienceLevel', v === '__all__' ? '' : v, { shouldValidate: true })}
              >
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
              <Label>Salaire (texte libre)</Label>
              <Input {...register('salaryText')} placeholder="45–55 k€" />
            </div>

            <div className="space-y-1.5">
              <Label>Date limite de candidature</Label>
              <Input type="date" {...register('applicationDeadline')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea
              {...register('description')}
              rows={10}
              placeholder="Missions, profil, contexte, avantages… (min. 20 caractères)"
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Compétences</Label>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {s}
                  <button
                    type="button"
                    aria-label={`Retirer ${s}`}
                    onClick={() => setSkills(skills.filter((x) => x !== s))}
                  >
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

          <label
            htmlFor="isFeatured"
            className="flex items-start gap-3 text-sm"
          >
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(v) => setValue('isFeatured', v === true)}
            />
            <span>
              <span className="font-medium">Mettre à la une</span>
              <br />
              <span className="text-xs text-muted-foreground">
                L’offre sera mise en avant sur la page d’accueil et en tête de liste.
              </span>
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Référencement (SEO)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Titre SEO</Label>
            <Input {...register('seoTitle')} placeholder="Laisser vide pour utiliser le titre du poste" />
          </div>
          <div className="space-y-1.5">
            <Label>Description SEO</Label>
            <Textarea {...register('seoDescription')} rows={3} placeholder="Résumé court de l’offre pour les moteurs de recherche…" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Création…
            </>
          ) : (
            <>
              <Save className="size-4" />
              Créer l’offre
            </>
          )}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/offres">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
