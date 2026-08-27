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

  const STATS = [
    { label: 'Offres publiées', value: stats.publishedJobs, icon: Briefcase, color: 'text-emerald-700 bg-emerald-100' },
    { label: 'Soumissions en attente', value: stats.pendingSubmissions, icon: Inbox, color: 'text-sky-700 bg-sky-100' },
    { label: 'Nouvelles candidatures', value: stats.newApplications, icon: Users, color: 'text-amber-700 bg-amber-100' },
    { label: 'Candidatures en revue', value: stats.underReviewApps, icon: Eye, color: 'text-purple-700 bg-purple-100' },
    { label: 'Offres clôturées', value: stats.closedJobs, icon: CheckCircle2, color: 'text-zinc-700 bg-zinc-100' },
    { label: 'E-mails en échec', value: stats.failedNotifications, icon: MailX, color: 'text-red-700 bg-red-100' },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-bold">Vue d’ensemble</h1>
        <p className="mt-1 text-muted-foreground">
          Activité récente et indicateurs clés de la plateforme.
        </p>
      </header>

      <section
        aria-label="Statistiques"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {STATS.map((s) => (
          <Card key={s.label}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </span>
                <span className={`flex size-7 items-center justify-center rounded-md ${s.color}`}>
                  <s.icon className="size-4" />
                </span>
              </div>
              <p className="mt-2 font-serif text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* RECENT SUBMISSIONS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg">Soumissions récentes</CardTitle>
              <CardDescription>
                Propositions d’offres à examiner
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link href="/admin/soumissions">
                Tout voir
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune soumission en attente.
              </p>
            ) : (
              <ul className="max-h-96 space-y-2 overflow-y-auto scroll-pretty">
                {recentSubmissions.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/admin/soumissions/${s.id}`}
                      className="block rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-muted/50"
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
                        <span className="font-mono">{s.publicReference}</span>
                        {s.submittedAt && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg">Candidatures récentes</CardTitle>
              <CardDescription>
                Dernières candidatures reçues
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link href="/admin/candidatures">
                Tout voir
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune candidature pour le moment.
              </p>
            ) : (
              <ul className="max-h-96 space-y-2 overflow-y-auto scroll-pretty">
                {recentApplications.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/admin/candidatures/${a.id}`}
                      className="block rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-muted/50"
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
                        <span className="font-mono">{a.publicReference}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
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
