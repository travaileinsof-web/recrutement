import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, MapPin, Briefcase, Euro, ArrowLeft, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ApplyForm } from '@/components/apply-form'
import { serverFetch } from '@/lib/server-fetch'
import { CONTRACT_LABELS, EXPERIENCE_LABELS } from '@/lib/status-labels'
import type { PublicJob } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const job = await serverFetch<PublicJob>(`/api/public/jobs/${slug}`)
  if (!job) return { title: 'Offre introuvable' }
  return { title: `Postuler · ${job.title}` }
}

export default async function ApplyPage({ params }: PageProps) {
  const { slug } = await params
  const job = await serverFetch<PublicJob>(`/api/public/jobs/${slug}`)
  if (!job) notFound()

  return (
    <div className="container mx-auto px-4 py-10">
      <nav aria-label="Fil d’Ariane" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/offres" className="hover:text-foreground">Offres</Link>
        <span className="mx-2">/</span>
        <Link href={`/offres/${job.slug}`} className="hover:text-foreground">{job.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Postuler</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* FORM */}
        <div>
          <header className="mb-6">
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Postuler à cette offre</h1>
            <p className="mt-2 text-muted-foreground">
              Remplissez le formulaire ci-dessous. Tous les champs marqués d’un{' '}
              <span className="text-destructive">*</span> sont obligatoires.
            </p>
          </header>

          <ApplyForm job={job} />
        </div>

        {/* STICKY JOB SUMMARY */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Vous postulez à</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold leading-snug">
                  {job.title}
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  {job.company && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="size-4 text-primary" />
                      {job.company.legalName}
                    </p>
                  )}
                  {job.location && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 text-primary" />
                      {job.location}
                    </p>
                  )}
                  {job.contractType && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="size-4 text-primary" />
                      {CONTRACT_LABELS[job.contractType] ?? job.contractType}
                    </p>
                  )}
                  {job.salaryText && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Euro className="size-4 text-primary" />
                      {job.salaryText}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Référence de l’offre</dt>
                  <dd className="font-mono text-xs text-foreground">
                    {job.publicReference}
                  </dd>
                </div>
                {job.experienceLevel && (
                  <div>
                    <dt className="text-muted-foreground">Niveau souhaité</dt>
                    <dd className="text-foreground">
                      {EXPERIENCE_LABELS[job.experienceLevel] ?? job.experienceLevel}
                    </dd>
                  </div>
                )}
              </dl>

              <Separator />

              {job.skills?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    Compétences
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 5).map((s) => (
                      <Badge key={s} variant="secondary" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/offres/${job.slug}`}>
                  <ArrowLeft className="size-4" />
                  Voir le détail de l’offre
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
            <Send className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p>
              Vos données ne sont jamais partagées avec d’autres entreprises.
              Le recruteur interne en charge de l’offre sera le seul à accéder à
              votre dossier.
            </p>
          </div>

          {/* Candidate testimonial — premium with portrait */}
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-premium-xs">
            <div className="flex items-center gap-3 p-4">
              <div className="relative size-12 shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-sm" aria-hidden />
                <div className="relative size-full overflow-hidden rounded-full ring-2 ring-white shadow-premium">
                  <img
                    src="/images/people/candidate-man.png"
                    alt="Candidat noir africain souriant"
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">
                  « J’ai postulé en 3 minutes, sans compte. »
                </p>
                <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                  Kofi A. · candidat validé
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
