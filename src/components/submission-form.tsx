'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Send, CheckCircle2, ShieldCheck } from 'lucide-react'
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
import { CONTRACT_LABELS } from '@/lib/status-labels'
import { WhatsAppChip } from '@/components/premium-ui'

type FormValues = {
  legalName: string
  tradeName?: string // Used for RCCM
  companyEmail: string
  contactPhone?: string
  title: string
  description: string
  location?: string
  contractType?: string
  consent: boolean
  websiteCheck?: string
  // Defaults to pass schema
  contactName: string
  contactEmail: string
}

const CONTRACT_OPTIONS = Object.entries(CONTRACT_LABELS)

export function SubmissionForm() {
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState<{ reference: string } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(JobSubmissionSchema),
    defaultValues: {
      contactName: 'Responsable', // Hidden default
      contactEmail: '', // Synced with companyEmail
    },
  })

  // Sync companyEmail to contactEmail
  const companyEmailVal = watch('companyEmail')
  React.useEffect(() => {
    setValue('contactEmail', companyEmailVal || '')
  }, [companyEmailVal, setValue])

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        requiredSkills: [],
      }

      const res = await fetch('/api/public/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error ?? 'Erreur lors de la soumission')
      }

      setSuccess({ reference: result.reference })
      toast.success('Offre envoyée avec succès')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setSubmitting(false)
    }
  })

  if (success) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center shadow-premium-sm">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-success/10 ring-1 ring-inset ring-success/20">
          <CheckCircle2 className="size-10 text-success" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground">Proposition reçue</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Notre équipe va examiner votre offre dans les plus brefs délais.
        </p>
        <div className="mx-auto mt-8 max-w-sm rounded-xl bg-secondary/30 p-6 border border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Référence de suivi
          </p>
          <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">
            {success.reference}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Conservez cette référence. Un e-mail de confirmation vous a été envoyé.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild variant="outline" className="gap-2 border-primary/20 hover:bg-secondary">
            <Link href="/suivi-candidature">
              Suivre la publication
            </Link>
          </Button>
          <Button asChild className="gap-2 shadow-premium-sm">
            <Link href="/offres">
              Voir le catalogue
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12" noValidate>
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input type="text" {...register('websiteCheck')} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
            1. L'Entreprise
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">Vos informations restent confidentielles jusqu'à validation.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nom de l'entreprise *" error={errors.legalName?.message}>
            <Input {...register('legalName')} placeholder="TalentForge SA" className="bg-secondary/30" />
          </Field>
          <Field 
            label="N° RCCM (Vérification)" 
            error={errors.tradeName?.message}
          >
            <div className="relative">
              <Input {...register('tradeName')} placeholder="GN.TCC.2024.B..." className="bg-secondary/30 pr-10" />
              <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-success/70" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Nécessaire pour garantir l'authenticité de l'offre.</p>
          </Field>
          <Field label="E-mail de contact *" error={errors.companyEmail?.message}>
            <Input type="email" {...register('companyEmail')} placeholder="rh@entreprise.gn" className="bg-secondary/30" />
          </Field>
          <Field label="Téléphone" error={errors.contactPhone?.message}>
            <Input type="tel" {...register('contactPhone')} placeholder="+224 6..." className="bg-secondary/30" />
          </Field>
        </div>
      </div>

      <hr className="border-border/60" />

      <div className="space-y-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-foreground">2. Le Poste</h3>
          <p className="text-muted-foreground mt-1 text-sm">Les détails de votre offre qui seront publiés.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Titre du poste *" className="sm:col-span-2" error={errors.title?.message}>
            <Input {...register('title')} placeholder="Développeur Full-Stack (H/F)" className="bg-secondary/30" />
          </Field>
          <Field label="Type de contrat" error={errors.contractType?.message}>
            <Select onValueChange={(val) => setValue('contractType', val)} defaultValue={watch('contractType')}>
              <SelectTrigger className="bg-secondary/30">
                <SelectValue placeholder="Sélectionnez..." />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_OPTIONS.map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Localisation" error={errors.location?.message}>
            <Input {...register('location')} placeholder="Conakry, Guinée" className="bg-secondary/30" />
          </Field>
          <Field label="Description du poste *" className="sm:col-span-2" error={errors.description?.message}>
            <Textarea
              {...register('description')}
              rows={8}
              className="resize-y bg-secondary/30 font-sans"
              placeholder="Décrivez les missions, le profil recherché et ce que vous offrez..."
            />
            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
              <span>Minimum 80 caractères. Soyez précis et authentique.</span>
              <span>{watch('description')?.length || 0} car.</span>
            </p>
          </Field>
        </div>
      </div>

      <hr className="border-border/60" />

      <div className="space-y-6">
        <label
          htmlFor="consent"
          className="group flex cursor-pointer items-start gap-4 rounded-xl border border-border bg-secondary/10 p-5 transition-colors hover:bg-secondary/30"
        >
          <Checkbox
            id="consent"
            checked={watch('consent')}
            onCheckedChange={(checked) => setValue('consent', checked === true)}
            className="mt-1 border-primary/30 text-primary data-[state=checked]:bg-primary"
          />
          <div className="grid gap-1.5">
            <span className="font-medium text-foreground">
              J'accepte les conditions générales
            </span>
            <span className="text-sm text-muted-foreground leading-relaxed">
              En soumettant cette offre, je certifie que les informations sont exactes et 
              j'accepte la politique de confidentialité. Un compte anonyme lié à cette 
              offre sera généré pour m'en permettre le suivi.
            </span>
            {errors.consent && (
              <span className="text-xs text-destructive mt-1 font-medium">{errors.consent.message}</span>
            )}
          </div>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="w-full sm:w-auto min-w-[200px] gap-2 shadow-premium-sm"
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" strokeWidth={2} />
          )}
          Soumettre l'offre
        </Button>
        
        <div className="text-center sm:text-right">
          <p className="text-sm text-muted-foreground mb-2">Besoin d'aide ?</p>
          <WhatsAppChip />
        </div>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      <Label className="text-sm font-semibold text-foreground/90">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
