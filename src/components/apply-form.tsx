'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { Loader2, Send, UploadCloud, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { ApplicationSchema } from '@/lib/validation'
import type { PublicJob } from '@/lib/types'

interface FormValues {
  candidateName: string
  candidateEmail: string
  candidatePhone?: string
  candidateCity?: string
  coverLetter?: string
  consent: boolean
  websiteCheck?: string
}

const MAX_FILE_MB = 10

export function ApplyForm({ job }: { job: PublicJob }) {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)
  const [cvFile, setCvFile] = React.useState<File | null>(null)
  const [coverFile, setCoverFile] = React.useState<File | null>(null)
  const [idempotencyKey] = React.useState(() => uuidv4())

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ApplicationSchema.omit({ jobId: true, answers: true })),
    defaultValues: {
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      candidateCity: '',
      coverLetter: '',
      consent: false,
      websiteCheck: '',
    },
  })

  const consent = watch('consent')

  const onSubmit = handleSubmit(async (values) => {
    if (!cvFile) {
      toast.error('Le CV est obligatoire.')
      return
    }
    if (cvFile.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Le CV dépasse la taille maximum de ${MAX_FILE_MB} Mo.`)
      return
    }
    if (coverFile && coverFile.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`La lettre de motivation dépasse la taille maximum de ${MAX_FILE_MB} Mo.`)
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.set('jobId', job.id)
      fd.set('candidateName', values.candidateName)
      fd.set('candidateEmail', values.candidateEmail)
      if (values.candidatePhone) fd.set('candidatePhone', values.candidatePhone)
      if (values.candidateCity) fd.set('candidateCity', values.candidateCity)
      if (values.coverLetter) fd.set('coverLetter', values.coverLetter)
      fd.set('consent', 'true')
      fd.set('idempotencyKey', idempotencyKey)
      fd.set('websiteCheck', values.websiteCheck ?? '')
      fd.set('cv', cvFile, cvFile.name)
      if (coverFile) fd.set('coverLetterFile', coverFile, coverFile.name)

      const res = await fetch('/api/public/applications', {
        method: 'POST',
        body: fd,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = json?.error?.message ?? 'Une erreur est survenue.'
        toast.error(msg)
        return
      }
      const data = json?.data ?? json
      toast.success('Candidature envoyée avec succès.')
      router.push(
        `/candidature/confirmation?ref=${encodeURIComponent(data.publicReference)}&token=${encodeURIComponent(data.trackingToken)}`,
      )
    } catch (e) {
      toast.error('Erreur réseau. Réessayez.')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Honeypot — hidden visually, must stay empty */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website-check">Ne pas remplir</label>
        <input
          id="website-check"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('websiteCheck')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="candidateName">
            Nom complet <span className="text-destructive">*</span>
          </Label>
          <Input
            id="candidateName"
            autoComplete="name"
            placeholder="Jean Dupont"
            aria-invalid={!!errors.candidateName}
            {...register('candidateName')}
          />
          {errors.candidateName && (
            <p className="text-xs text-destructive">{errors.candidateName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="candidateEmail">
            E-mail <span className="text-destructive">*</span>
          </Label>
          <Input
            id="candidateEmail"
            type="email"
            autoComplete="email"
            placeholder="jean.dupont@email.com"
            aria-invalid={!!errors.candidateEmail}
            {...register('candidateEmail')}
          />
          {errors.candidateEmail && (
            <p className="text-xs text-destructive">{errors.candidateEmail.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="candidatePhone">Téléphone</Label>
          <Input
            id="candidatePhone"
            type="tel"
            autoComplete="tel"
            placeholder="+33 6 12 34 56 78"
            {...register('candidatePhone')}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="candidateCity">Ville</Label>
          <Input
            id="candidateCity"
            autoComplete="address-level2"
            placeholder="Paris"
            {...register('candidateCity')}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverLetter">Lettre de motivation (texte)</Label>
        <Textarea
          id="coverLetter"
          rows={6}
          placeholder="Expliquez en quelques paragraphes pourquoi vous êtes le/la bon·e candidat·e pour ce poste…"
          maxLength={20000}
          {...register('coverLetter')}
        />
        <p className="text-xs text-muted-foreground">
          Optionnel si vous joignez une lettre en fichier.
        </p>
      </div>

      <FileField
        id="cv"
        label="CV (PDF ou DOCX)"
        required
        file={cvFile}
        onPick={setCvFile}
      />

      <FileField
        id="coverLetterFile"
        label="Lettre de motivation (fichier, optionnel)"
        file={coverFile}
        onPick={setCoverFile}
      />

      <div className="space-y-2">
        <label
          htmlFor="consent"
          className="flex items-start gap-3 text-sm leading-relaxed"
        >
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(v) => setValue('consent', v === true, { shouldValidate: true })}
          />
          <span className="text-foreground">
            J’accepte que mes données soient traitées par TalentForge dans le cadre
            de ma candidature, conformément à la{' '}
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
          <p className="text-xs text-destructive">{errors.consent.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={submitting} className="gap-2">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Envoyer ma candidature
            </>
          )}
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={`/offres/${job.slug}`}>Annuler</Link>
        </Button>
      </div>

      <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
        <CheckCircle2 className="mb-1 inline size-4 text-primary" />
        Une fois envoyée, vous recevrez un e-mail avec un lien privé pour suivre
        l’avancement de votre candidature. Aucune création de compte n’est nécessaire.
      </div>
    </form>
  )
}

function FileField({
  id,
  label,
  required,
  file,
  onPick,
}: {
  id: string
  label: string
  required?: boolean
  file: File | null
  onPick: (f: File | null) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3">
          <div className="flex min-w-0 items-center gap-2">
            <UploadCloud className="size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} Ko · {file.type || 'inconnu'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Retirer le fichier"
            onClick={() => {
              onPick(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted"
        >
          <UploadCloud className="size-6 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Cliquez pour sélectionner un fichier
          </span>
          <span className="text-xs text-muted-foreground">
            Formats acceptés : .pdf, .docx — Max {MAX_FILE_MB} Mo
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null
          onPick(f)
        }}
      />
    </div>
  )
}
