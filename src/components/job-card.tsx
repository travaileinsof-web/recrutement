import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Briefcase, MapPin, ArrowUpRight, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONTRACT_LABELS } from '@/lib/status-labels'
import type { PublicJob } from '@/lib/types'

export function JobCard({ job }: { job: PublicJob }) {
  const publishedAt = job.publishedAt ? new Date(job.publishedAt) : null
  return (
    <Card className="group flex h-full flex-col transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {job.company?.legalName ?? 'Entreprise'}
            </p>
            <CardTitle className="font-serif text-lg leading-snug">
              <Link
                href={`/offres/${job.slug}`}
                className="after:absolute after:inset-0 hover:text-primary"
              >
                {job.title}
              </Link>
            </CardTitle>
          </div>
          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {job.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {job.location}
            </span>
          )}
          {job.contractType && (
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-3.5" />
              {CONTRACT_LABELS[job.contractType] ?? job.contractType}
            </span>
          )}
          {publishedAt && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatDistanceToNow(publishedAt, { addSuffix: true, locale: fr })}
            </span>
          )}
        </div>

        {job.salaryText && (
          <p className="text-sm font-medium text-foreground">
            {job.salaryText}
          </p>
        )}

        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((s) => (
              <Badge key={s} variant="secondary" className="font-normal">
                {s}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3">
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href={`/offres/${job.slug}`}>Voir l’offre</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
