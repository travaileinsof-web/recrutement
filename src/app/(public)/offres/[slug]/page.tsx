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
    <div className="container mx-auto px-4 py-10">
      <JobPostingJsonLd job={job} />

      <nav aria-label="Fil d’Ariane" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/offres" className="hover:text-foreground">Offres</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{job.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* MAIN CONTENT */}
        <article>
          <header className="mb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {job.isFeatured && (
                <Badge className="bg-accent text-accent-foreground">À la une</Badge>
              )}
              {job.category && (
                <Badge variant="outline" className="font-normal">
                  {job.category}
                </Badge>
              )}
              {job.contractType && (
                <Badge variant="secondary" className="font-normal">
                  {CONTRACT_LABELS[job.contractType] ?? job.contractType}
                </Badge>
              )}
              {job.experienceLevel && (
                <Badge variant="outline" className="font-normal">
                  {EXPERIENCE_LABELS[job.experienceLevel] ?? job.experienceLevel}
                </Badge>
              )}
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
              {job.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {job.company && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-4 text-primary" />
                  {job.company.tradeName ?? job.company.legalName}
                </span>
              )}
              {job.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" />
                  {job.location}
                </span>
              )}
              {job.contractType && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-4 text-primary" />
                  {CONTRACT_LABELS[job.contractType] ?? job.contractType}
                </span>
              )}
              {job.salaryText && (
                <span className="inline-flex items-center gap-1.5">
                  <Euro className="size-4 text-primary" />
                  {job.salaryText}
                </span>
              )}
            </div>
          </header>

          {job.skills?.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold">
                <Tag className="size-4 text-accent" />
                Compétences clés
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <Separator className="my-6" />

          <section className="prose prose-zinc max-w-none">
            <h2 className="font-serif text-xl font-semibold">Description du poste</h2>
            <div className="mt-3 space-y-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {job.description}
            </div>
          </section>
        </article>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Référence</dt>
                  <dd className="font-mono text-xs text-foreground">
                    {job.publicReference}
                  </dd>
                </div>
                {job.company && (
                  <div>
                    <dt className="text-muted-foreground">Entreprise</dt>
                    <dd className="text-foreground">
                      {job.company.legalName}
                      {job.company.sector && (
                        <span className="block text-xs text-muted-foreground">
                          {job.company.sector}
                        </span>
                      )}
                    </dd>
                  </div>
                )}
                {publishedAt && (
                  <div>
                    <dt className="text-muted-foreground">Publiée le</dt>
                    <dd className="inline-flex items-center gap-1.5 text-foreground">
                      <Calendar className="size-3.5" />
                      {format(publishedAt, 'dd MMMM yyyy', { locale: fr })}
                    </dd>
                  </div>
                )}
                {deadline && (
                  <div>
                    <dt className="text-muted-foreground">Date limite</dt>
                    <dd
                      className={`inline-flex items-center gap-1.5 ${
                        isClosed ? 'text-destructive' : 'text-foreground'
                      }`}
                    >
                      <Clock className="size-3.5" />
                      {format(deadline, 'dd MMMM yyyy', { locale: fr })}
                      {isClosed && ' (clôturée)'}
                    </dd>
                  </div>
                )}
              </dl>

              <Separator />

              {isClosed ? (
                <Button disabled className="w-full">
                  Candidatures clôturées
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full" variant="default">
                  <Link href={`/offres/${job.slug}/postuler`}>
                    <Send className="size-4" />
                    Postuler à cette offre
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href="/offres">Retour aux offres</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
