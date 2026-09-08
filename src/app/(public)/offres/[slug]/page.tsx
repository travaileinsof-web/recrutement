import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Euro,
  Send,
  Tag,
  ArrowLeft,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
  return {
    title: job.seoTitle ?? job.title,
    description:
      job.seoDescription ??
      `${job.title} · ${job.company?.legalName ?? ''} · ${job.location ?? 'France'}`.trim(),
  }
}

function JobPostingJsonLd({ job }: { job: PublicJob }) {
  const json = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt ?? undefined,
    validThrough: job.applicationDeadline ?? undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company?.legalName ?? 'TalentForge',
    },
    jobLocation: job.location
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location,
            addressCountry: job.country ?? 'France',
          },
        }
      : undefined,
    employmentType: job.contractType,
    qualifications: job.skills?.join(', ') || undefined,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params
  const job = await serverFetch<PublicJob>(`/api/public/jobs/${slug}`)
  if (!job) notFound()

  const publishedAt = job.publishedAt ? new Date(job.publishedAt) : null
  const deadline = job.applicationDeadline ? new Date(job.applicationDeadline) : null
  const isClosed = deadline ? deadline < new Date() : false

  return (
    <div className="bg-texture-subtle">
      <JobPostingJsonLd job={job} />

      {/* Hero header — premium with gradient */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary/60 via-background to-background">
        <div className="absolute inset-0 -z-10 opacity-50" aria-hidden>
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Fil d’Ariane" className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Accueil</Link>
            <span className="text-border">/</span>
            <Link href="/offres" className="transition-colors hover:text-foreground">Offres</Link>
            <span className="text-border">/</span>
            <span className="font-medium text-foreground line-clamp-1">{job.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <article>
              <header>
                {/* Badges — premium refined */}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  {job.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-accent/20">
                      <Star className="size-3 fill-current" strokeWidth={1.5} />
                      À la une
                    </span>
                  )}
                  {job.category && (
                    <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
                      {job.category}
                    </span>
                  )}
                  {job.contractType && (
                    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {CONTRACT_LABELS[job.contractType] ?? job.contractType}
                    </span>
                  )}
                  {job.experienceLevel && (
                    <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
                      {EXPERIENCE_LABELS[job.experienceLevel] ?? job.experienceLevel}
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
                  {job.title}
                </h1>

                {/* Meta — refined inline icons */}
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-muted-foreground">
                  {job.company && (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="size-4 text-primary" strokeWidth={1.75} />
                      <span className="font-medium text-foreground/90">
                        {job.company.tradeName ?? job.company.legalName}
                      </span>
                    </span>
                  )}
                  {job.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-primary" strokeWidth={1.75} />
                      {job.location}
                    </span>
                  )}
                  {job.contractType && (
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="size-4 text-primary" strokeWidth={1.75} />
                      {CONTRACT_LABELS[job.contractType] ?? job.contractType}
                    </span>
                  )}
                  {job.salaryText && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Euro className="size-4 text-accent" strokeWidth={1.75} />
                      {job.salaryText}
                    </span>
                  )}
                </div>
              </header>
            </article>
          </div>
        </div>
      </section>

      {/* Main content + sidebar */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <article>
            {/* Skills section */}
            {job.skills?.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
                  <Tag className="size-4 text-accent" strokeWidth={1.75} />
                  Compétences clés
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="border border-primary/10 bg-secondary/60 font-normal text-secondary-foreground"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <Separator className="mb-8" />

            {/* Description */}
            <section>
              <h2 className="mb-4 font-serif text-xl font-semibold tracking-tight">
                Description du poste
              </h2>
              <div className="space-y-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-foreground/90">
                {job.description}
              </div>
            </section>
          </article>

          {/* SIDEBAR — premium sticky card */}
          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <Card className="overflow-hidden border-border/80 shadow-premium-lg">
              <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg font-semibold tracking-tight">
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="space-y-3.5 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Référence
                    </dt>
                    <dd className="font-mono text-xs text-foreground">
                      {job.publicReference}
                    </dd>
                  </div>
                  {job.company && (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Entreprise
                      </dt>
                      <dd className="text-right text-sm text-foreground">
                        {job.company.legalName}
                        {job.company.sector && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {job.company.sector}
                          </span>
                        )}
                      </dd>
                    </div>
                  )}
                  {publishedAt && (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Publiée le
                      </dt>
                      <dd className="inline-flex items-center gap-1.5 text-sm text-foreground">
                        <Calendar className="size-3.5" strokeWidth={1.75} />
                        {format(publishedAt, 'dd MMM yyyy', { locale: fr })}
                      </dd>
                    </div>
                  )}
                  {deadline && (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Date limite
                      </dt>
                      <dd
                        className={`inline-flex items-center gap-1.5 text-sm ${
                          isClosed ? 'text-destructive' : 'text-foreground'
                        }`}
                      >
                        <Clock className="size-3.5" strokeWidth={1.75} />
                        {format(deadline, 'dd MMM yyyy', { locale: fr })}
                        {isClosed && ' (clôturée)'}
                      </dd>
                    </div>
                  )}
                </dl>

                <Separator />

                {isClosed ? (
                  <Button disabled size="lg" className="w-full">
                    Candidatures clôturées
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full gap-2 shadow-premium-sm">
                    <Link href={`/offres/${job.slug}/postuler`}>
                      <Send className="size-4" strokeWidth={2} />
                      Postuler à cette offre
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link href="/offres">
                    <ArrowLeft className="size-4" strokeWidth={1.75} />
                    Retour aux offres
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
