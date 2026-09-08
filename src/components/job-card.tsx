import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Briefcase, MapPin, ArrowUpRight, Clock, Banknote, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CONTRACT_LABELS } from '@/lib/status-labels'
import type { PublicJob } from '@/lib/types'

export function JobCard({ job }: { job: PublicJob }) {
  const publishedAt = job.publishedAt ? new Date(job.publishedAt) : null
  return (
    <Card
      className="hover-lift group relative flex h-full flex-col overflow-hidden border-border/80 shadow-premium-xs hover:border-primary/30 hover:shadow-premium-lg"
    >
      {/* Top accent line — subtle, animates on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-[0.65rem] font-semibold uppercase tracking-wide text-primary">
                {job.company?.legalName?.[0] ?? 'E'}
              </span>
              <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {job.company?.legalName ?? 'Entreprise'}
              </p>
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber-700">
                  <Star className="size-2.5 fill-current" />
                  À la une
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight text-foreground">
              <Link
                href={`/offres/${job.slug}`}
                className="after:absolute after:inset-0 transition-colors hover:text-primary"
              >
                {job.title}
              </Link>
            </h3>
          </div>
          <ArrowUpRight
            className="size-5 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Meta — icons inline */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {job.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" strokeWidth={1.75} />
              {job.location}
            </span>
          )}
          {job.contractType && (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="size-3.5" strokeWidth={1.75} />
              {CONTRACT_LABELS[job.contractType] ?? job.contractType}
            </span>
          )}
          {publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" strokeWidth={1.75} />
              {formatDistanceToNow(publishedAt, { addSuffix: true, locale: fr })}
            </span>
          )}
        </div>

        {/* Salary — highlighted */}
        {job.salaryText && (
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Banknote className="size-4 text-accent" strokeWidth={1.75} />
            {job.salaryText}
          </p>
        )}

        {/* Skills — refined badges */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="border border-primary/10 bg-secondary/60 font-normal text-secondary-foreground"
              >
                {s}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer — reference + CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
          <span className="font-mono text-[0.7rem] text-muted-foreground">
            {job.publicReference}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors group-hover:text-accent">
            Voir l’offre
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
