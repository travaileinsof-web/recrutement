'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Send, X, CheckCircle2, Plus } from 'lucide-react'
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
import { JobSubmissionSchema } from '@/lib/validation'
import { CONTRACT_LABELS, EXPERIENCE_LABELS } from '@/lib/status-labels'

type FormValues = {
  legalName: string
  tradeName?: string
  companyEmail: string
  companyPhone?: string
  website?: string
  sector?: string
  city?: string
  country?: string
  address?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  title: string
  description: string
  location?: string
  contractType?: string
  experienceLevel?: string
  salaryText?: string
  requiredSkills: string[]
  deadline?: string
  consent: boolean
  websiteCheck?: string
}

const CONTRACT_OPTIONS = Object.entries(CONTRACT_LABELS)
const EXPERIENCE_OPTIONS = Object.entries(EXPERIENCE_LABELS)

export function SubmissionForm() {
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState<{ reference: string } | null>(null)
  const [skills, setSkills] = React.useState<string[]>([])
  const [skillInput, setSkillInput] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(JobSubmissionSchema) as never,
    defaultValues: {
      legalName: '',
      tradeName: '',
      companyEmail: '',
      companyPhone: '',
      website: '',
      sector: '',
      city: '',
      country: 'Guin�e',
      address: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      title: '',
      description: '',
      location: '',
      contractType: '',
      experienceLevel: '',
      salaryText: '',
      requiredSkills: [],
      deadline: '',
      consent: false,
      websiteCheck: '',
    },
  })

  const consent = watch('consent')
  const contractType = watch('contractType')
  const experienceLevel = watch('experienceLevel')

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      const payload = { ...values, requiredSkills: skills }
      const res = await fetch('/api/public/job-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = json?.error?.message ?? 'Une erreur est survenue.'
        toast.error(msg)
        if (json?.error?.issues) {
          const first = json.error.issues[0]
          if (first) toast.error(`${first.path}: ${first.message}`)
        }
        return
      }
      const data = json?.data ?? json
      setSuccess({ reference: data.publicReference })
      toast.success('Proposition envoyée !')
    } catch (e) {
      toast.error('Erreur réseau. Réessayez.')
    } finally {
      setSubmitting(false)
    }
  })

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-8 text-emerald-700" />
        </div>
        <h2 className="font-serif text-2xl font-bold">Proposition reçue</h2>
        <p className="mt-3 text-muted-foreground">
          Merci ! Notre équipe examine votre proposition et reviendra vers vous
          sous 48h ouvrées.
        </p>
        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Votre numéro de référence
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-foreground">
            {success.reference}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Conservez cette référence pour toute communication avec notre équipe.
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/offres">Voir les offres</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(null)
              setSkills([])
            }}
          >
            Proposer une autre offre
          </Button>
        </div>
      </div>
    )
  }

  const addSkill = () => {
    const v = skillInput.trim()
    if (!v) return
    if (skills.includes(v)) return
    if (skills.length >= 20) {
      toast.error('Maximum 20 compétences.')
      return
    }
    setSkills([...skills, v])
    setSkillInput('')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10" noValidate>
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website-check-sub">Ne pas remplir</label>
        <input
          id="website-check-sub"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('websiteCheck')}
        />
      </div>

      {/* ENTREPRISE */}
      <Section
        number={1}
        title="Entreprise"
        description="Informations légales sur l’entreprise qui propose l’offre."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Raison sociale"
            required
            error={errors.legalName?.message as string}
          >
            <Input
              {...register('legalName')}
              autoComplete="organization"
              placeholder="Acme Robotics SAS"
              aria-invalid={!!errors.legalName}
            />
          </Field>
          <Field label="Nom commercial">
            <Input
              {...register('tradeName')}
              placeholder="Acme"
            />
          </Field>
          <Field
            label="E-mail entreprise"
            required
            error={errors.companyEmail?.message as string}
          >
            <Input
              type="email"
              {...register('companyEmail')}
              autoComplete="work email"
              placeholder="contact@entreprise.fr"
              aria-invalid={!!errors.companyEmail}
            />
          </Field>
          <Field label="Téléphone entreprise">
            <Input
              type="tel"
              {...register('companyPhone')}
              placeholder="+224 621 11 22 33"
            />
          </Field>
          <Field
            label="Site web"
            error={errors.website?.message as string}
          >
            <Input
              type="url"
              {...register('website')}
              placeholder="https://entreprise.fr"
            />
          </Field>
          <Field label="Secteur d’activité">
            <Input
              {...register('sector')}
              placeholder="Robotique, Énergie, Santé…"
            />
          </Field>
          <Field label="Ville">
            <Input
              {...register('city')}
              placeholder="Conakry"
            />
          </Field>
          <Field label="Pays">
            <Input
              {...register('country')}
              defaultValue="Guin�e"
              placeholder="Guin�e"
            />
          </Field>
          <Field label="Adresse" className="sm:col-span-2">
            <Input
              {...register('address')}
              placeholder="Avenue de la République, Kaloum, Conakry"
            />
          </Field>
        </div>
      </Section>

      {/* CONTACT */}
      <Section
        number={2}
        title="Contact"
        description="La personne avec qui nous échangerons au sujet de cette offre."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Nom du contact"
            required
            error={errors.contactName?.message as string}
          >
            <Input
              {...register('contactName')}
              placeholder="Camille Dubois"
              aria-invalid={!!errors.contactName}
            />
          </Field>
          <Field
            label="E-mail du contact"
            required
            error={errors.contactEmail?.message as string}
          >
            <Input
              type="email"
              {...register('contactEmail')}
              placeholder="camille@entreprise.fr"
              aria-invalid={!!errors.contactEmail}
            />
          </Field>
          <Field label="Téléphone du contact">
            <Input
              type="tel"
              {...register('contactPhone')}
              placeholder="+224 622 33 44 55"
            />
          </Field>
        </div>
      </Section>

      {/* POSTE */}
      <Section
        number={3}
        title="Poste"
        description="Décrivez le poste à pourvoir. La description doit contenir au moins 80 caractères."
      >
        <div className="grid gap-4">
          <Field
            label="Titre du poste"
            required
            error={errors.title?.message as string}
          >
            <Input
              {...register('title')}
              placeholder="Ingénieur·e Robotique Senior"
              aria-invalid={!!errors.title}
            />
          </Field>
          <Field
            label="Description du poste"
            required
            error={errors.description?.message as string}
          >
            <Textarea
              {...register('description')}
              rows={8}
              placeholder="Missions, profil recherché, contexte, avantages… (min. 80 caractères)"
              aria-invalid={!!errors.description}
            />
            <p className="text-xs text-muted-foreground">
              Astuce : séparez les sections par des lignes vides pour une meilleure lisibilité.
            </p>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Localisation">
              <Input
                {...register('location')}
                placeholder="Conakry — hybride"
              />
            </Field>
            <Field
              label="Type de contrat"
              error={errors.contractType?.message as string}
            >
              <Select
                value={contractType || '__all__'}
                onValueChange={(v) =>
                  setValue('contractType', v === '__all__' ? '' : v, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">—</SelectItem>
                  {CONTRACT_OPTIONS.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field
              label="Niveau d’expérience"
              error={errors.experienceLevel?.message as string}
            >
              <Select
                value={experienceLevel || '__all__'}
                onValueChange={(v) =>
                  setValue('experienceLevel', v === '__all__' ? '' : v, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">—</SelectItem>
                  {EXPERIENCE_OPTIONS.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Salaire (texte libre)">
              <Input
                {...register('salaryText')}
                placeholder="45–55 k€ + bonus"
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* CRITÈRES */}
      <Section
        number={4}
        title="Critères"
        description="Compétences attendues et date limite de candidature."
      >
        <div className="grid gap-4">
          <Field label="Compétences requises">
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
            <div className="mt-2 flex gap-2">
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
            <p className="text-xs text-muted-foreground">
              Astuce : séparez les compétences par Entrée ou virgule. Max 20.
            </p>
          </Field>
          <Field
            label="Date limite de candidature"
            error={errors.deadline?.message as string}
          >
            <Input
              type="date"
              {...register('deadline')}
            />
          </Field>
        </div>
      </Section>

      {/* CONSENTEMENT */}
      <Section
        number={5}
        title="Consentement"
        description="Acceptez les conditions pour que votre proposition soit traitée."
      >
        <label
          htmlFor="sub-consent"
          className="flex items-start gap-3 text-sm leading-relaxed"
        >
          <Checkbox
            id="sub-consent"
            checked={consent}
            onCheckedChange={(v) => setValue('consent', v === true, { shouldValidate: true })}
          />
          <span className="text-foreground">
            Je certifie que les informations fournies sont exactes et j’accepte
            que TalentForge les traite pour évaluer ma proposition d’offre,
            conformément à la{' '}
            <Link
              href="/confidentialite"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              politique de confidentialité
            </Link>
            . <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-xs text-destructive">{errors.consent.message}</p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" size="lg" disabled={submitting} className="gap-2">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                <Send className="size-4" />
                Envoyer ma proposition
              </>
            )}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/offres">Voir les offres existantes</Link>
          </Button>
        </div>
      </Section>
    </form>
  )
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: number
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <header className="mb-5 flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {number}
        </span>
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

