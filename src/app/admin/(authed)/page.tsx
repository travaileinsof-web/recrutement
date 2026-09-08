import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Briefcase,
  Inbox,
  Users,
  Eye,
  CheckCircle2,
  MailX,
  ArrowRight,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/lib/status-labels'
import { serverFetch } from '@/lib/server-fetch'
import type { DashboardData } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function fetchDashboard(): Promise<DashboardData | null> {
  return serverFetch<DashboardData>('/api/admin/dashboard')
}

interface StatItem {
  label: string
  value: number
  icon: LucideIcon
  // Tailwind classes for icon container — semantic colors only
  accent: string
}

export default async function AdminDashboardPage() {
  const data = await fetchDashboard()

  const stats = data?.stats ?? {
    publishedJobs: 0,
    pendingSubmissions: 0,
    pendingReviewJobs: 0,
    newApplications: 0,
    underReviewApps: 0,
    closedJobs: 0,
    failedNotifications: 0,
  }

  const recentSubmissions = data?.recentSubmissions ?? []
  const recentApplications = data?.recentApplications ?? []

  const STATS: StatItem[] = [
    { label: 'Offres publiées', value: stats.publishedJobs, icon: Briefcase, accent: 'text-emerald-700 bg-emerald-50 ring-emerald-100' },
    { label: 'Soumissions en attente', value: stats.pendingSubmissions, icon: Inbox, accent: 'text-sky-700 bg-sky-50 ring-sky-100' },
    { label: 'Nouvelles candidatures', value: stats.newApplications, icon: Users, accent: 'text-amber-700 bg-amber-50 ring-amber-100' },
    { label: 'Candidatures en revue', value: stats.underReviewApps, icon: Eye, accent: 'text-purple-700 bg-purple-50 ring-purple-100' },
    { label: 'Offres clôturées', value: stats.closedJobs, icon: CheckCircle2, accent: 'text-zinc-700 bg-zinc-50 ring-zinc-200' },
    { label: 'E-mails en échec', value: stats.failedNotifications, icon: MailX, accent: 'text-red-700 bg-red-50 ring-red-100' },
  ]

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Tableau de bord
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground">
          Vue d’ensemble
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activité récente et indicateurs clés de la plateforme.
        </p>
      </header>

      {/* STAT CARDS — premium version */}
      <section
        aria-label="Statistiques"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {STATS.map((s, i) => (
          <Card
            key={s.label}
            className="hover-lift animate-fade-in-up overflow-hidden border-border/80 shadow-premium-xs hover:shadow-premium"
            style={{ animationDelay: `${i * 40}ms` } as React.CSSProperties}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-2 font-serif text-3xl font-bold leading-none tracking-tight text-foreground">
                    {s.value}
                  </p>
                </div>
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${s.accent}`}>
                  <s.icon className="size-4" strokeWidth={1.75} />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* RECENT ACTIVITY — two-column premium layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RECENT SUBMISSIONS */}
        <Card className="overflow-hidden border-border/80 shadow-premium-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-secondary/30 py-4">
            <div>
              <CardTitle className="font-serif text-lg font-semibold tracking-tight">
                Soumissions récentes
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                Propositions d’offres à examiner
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-primary">
              <Link href="/admin/soumissions">
                Tout voir
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-3">
            {recentSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <Inbox className="size-4 text-muted-foreground" strokeWidth={1.75} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Aucune soumission en attente.
                </p>
              </div>
            ) : (
              <ul className="max-h-96 space-y-1 overflow-y-auto scroll-pretty">
                {recentSubmissions.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/admin/soumissions/${s.id}`}
                      className="hover-lift block rounded-lg border border-transparent p-3 transition-colors hover:border-primary/20 hover:bg-secondary/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {s.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {s.contactName} · {s.company?.legalName ?? 'Nouvelle entreprise'}
                          </p>
                        </div>
                        <StatusBadge status={s.status} kind="submission" />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-mono text-[0.7rem]">{s.publicReference}</span>
                        {s.submittedAt && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" strokeWidth={1.75} />
                            {formatDistanceToNow(new Date(s.submittedAt), { addSuffix: true, locale: fr })}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* RECENT APPLICATIONS */}
        <Card className="overflow-hidden border-border/80 shadow-premium-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-secondary/30 py-4">
            <div>
              <CardTitle className="font-serif text-lg font-semibold tracking-tight">
                Candidatures récentes
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                Dernières candidatures reçues
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-primary">
              <Link href="/admin/candidatures">
                Tout voir
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-3">
            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <Users className="size-4 text-muted-foreground" strokeWidth={1.75} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Aucune candidature pour le moment.
                </p>
              </div>
            ) : (
              <ul className="max-h-96 space-y-1 overflow-y-auto scroll-pretty">
                {recentApplications.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/admin/candidatures/${a.id}`}
                      className="hover-lift block rounded-lg border border-transparent p-3 transition-colors hover:border-primary/20 hover:bg-secondary/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {a.candidateName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {a.job.title} · {a.job.company.legalName}
                          </p>
                        </div>
                        <StatusBadge status={a.status} kind="application" />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-mono text-[0.7rem]">{a.publicReference}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" strokeWidth={1.75} />
                          {formatDistanceToNow(new Date(a.submittedAt), { addSuffix: true, locale: fr })}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
