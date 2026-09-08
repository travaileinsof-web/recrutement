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
  Building2,
  FileText,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/lib/status-labels'
import { serverFetch } from '@/lib/server-fetch'
import { ActivityChart } from '@/components/admin/activity-chart'
import type { DashboardData } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function fetchDashboard(): Promise<DashboardData | null> {
  return serverFetch<DashboardData>('/api/admin/dashboard')
}

interface StatItem {
  label: string
  value: number
  icon: LucideIcon
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
    totalCompanies: 0,
    totalApplications: 0,
    totalJobs: 0,
  }

  const recentSubmissions = data?.recentSubmissions ?? []
  const recentApplications = data?.recentApplications ?? []
  const activity = data?.activity ?? []
  const prioritySubs = data?.priorityActions?.pendingSubmissions ?? []
  const priorityApps = data?.priorityActions?.unreviewedApplications ?? []

  const STATS: StatItem[] = [
    { label: 'Offres publiées', value: stats.publishedJobs, icon: Briefcase, accent: 'text-emerald-700 bg-emerald-50 ring-emerald-100' },
    { label: 'Soumissions en attente', value: stats.pendingSubmissions, icon: Inbox, accent: 'text-sky-700 bg-sky-50 ring-sky-100' },
    { label: 'Nouvelles candidatures', value: stats.newApplications, icon: Users, accent: 'text-amber-700 bg-amber-50 ring-amber-100' },
    { label: 'En revue', value: stats.underReviewApps, icon: Eye, accent: 'text-purple-700 bg-purple-50 ring-purple-100' },
    { label: 'Offres clôturées', value: stats.closedJobs, icon: CheckCircle2, accent: 'text-zinc-700 bg-zinc-50 ring-zinc-200' },
    { label: 'E-mails en échec', value: stats.failedNotifications, icon: MailX, accent: 'text-red-700 bg-red-50 ring-red-100' },
  ]

  // Totals for the overview row
  const TOTALS: Array<{ label: string; value: number; icon: LucideIcon }> = [
    { label: 'Offres totales', value: stats.totalJobs ?? 0, icon: Briefcase },
    { label: 'Candidatures totales', value: stats.totalApplications ?? 0, icon: FileText },
    { label: 'Entreprises', value: stats.totalCompanies ?? 0, icon: Building2 },
  ]

  const priorityCount = prioritySubs.length + priorityApps.length + stats.failedNotifications

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Tableau de bord
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground">
          Vue d&apos;ensemble
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activité récente et indicateurs clés de la plateforme.
        </p>
      </header>

      {/* STAT CARDS — premium version */}
      <section aria-label="Statistiques" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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

      {/* OVERVIEW + ACTIVITY CHART */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Totals overview */}
        <Card className="overflow-hidden border-border/80 shadow-premium-xs">
          <CardHeader className="border-b border-border/60 bg-secondary/30 py-4">
            <CardTitle className="font-serif text-base font-semibold tracking-tight">
              Vue d&apos;ensemble
            </CardTitle>
            <CardDescription className="text-xs">Totaux cumulés</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <dl className="space-y-4">
              {TOTALS.map((t) => (
                <div key={t.label} className="flex items-center justify-between">
                  <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <t.icon className="size-4 text-primary" strokeWidth={1.75} />
                    {t.label}
                  </dt>
                  <dd className="font-serif text-xl font-bold tracking-tight text-foreground">
                    {t.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* Activity chart */}
        <Card className="overflow-hidden border-border/80 shadow-premium-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-secondary/30 py-4">
            <div>
              <CardTitle className="font-serif text-base font-semibold tracking-tight">
                Activité (7 jours)
              </CardTitle>
              <CardDescription className="text-xs">
                Candidatures et soumissions reçues
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-accent" />
                <span className="text-muted-foreground">Candidatures</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-primary/30" />
                <span className="text-muted-foreground">Soumissions</span>
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {activity.length > 0 ? (
              <div className="space-y-3">
                <ActivityChart data={activity} />
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune activité récente.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* PRIORITY ACTIONS — actionable items */}
      {priorityCount > 0 && (
        <Card className="overflow-hidden border-amber-200 shadow-premium-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-amber-100 bg-amber-50/60 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200">
                <AlertTriangle className="size-4" strokeWidth={2} />
              </div>
              <div>
                <CardTitle className="font-serif text-base font-semibold tracking-tight">
                  Actions prioritaires
                </CardTitle>
                <CardDescription className="text-xs">
                  {priorityCount} élément{priorityCount > 1 ? 's' : ''} à traiter
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Pending submissions */}
              {prioritySubs.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Soumissions à examiner
                  </p>
                  <ul className="space-y-2">
                    {prioritySubs.slice(0, 3).map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/admin/soumissions/${s.id}`}
                          className="hover-lift block rounded-lg border border-border p-3 transition-colors hover:border-primary/20 hover:bg-secondary/40"
                        >
                          <p className="truncate text-sm font-medium text-foreground">{s.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {s.company?.legalName ?? 'Nouvelle entreprise'}
                            {s.submittedAt && ` · ${formatDistanceToNow(new Date(s.submittedAt), { addSuffix: true, locale: fr })}`}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Unreviewed applications */}
              {priorityApps.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Candidatures à examiner
                  </p>
                  <ul className="space-y-2">
                    {priorityApps.slice(0, 3).map((a) => (
                      <li key={a.id}>
                        <Link
                          href={`/admin/candidatures/${a.id}`}
                          className="hover-lift block rounded-lg border border-border p-3 transition-colors hover:border-primary/20 hover:bg-secondary/40"
                        >
                          <p className="truncate text-sm font-medium text-foreground">{a.candidateName}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {a.job.title}
                            {a.submittedAt && ` · ${formatDistanceToNow(new Date(a.submittedAt), { addSuffix: true, locale: fr })}`}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Failed notifications */}
              {stats.failedNotifications > 0 && (
                <div className="md:col-span-2">
                  <Link
                    href="/admin/parametres"
                    className="hover-lift flex items-center gap-3 rounded-lg border border-red-200 bg-red-50/50 p-3 transition-colors hover:bg-red-50"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-red-100 text-red-700 ring-1 ring-inset ring-red-200">
                      <MailX className="size-4" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {stats.failedNotifications} e-mail{stats.failedNotifications > 1 ? 's' : ''} en échec
                      </p>
                      <p className="text-xs text-muted-foreground">Cliquez pour relancer l&apos;envoi depuis les paramètres</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" strokeWidth={2} />
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
                Propositions d&apos;offres à examiner
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
