import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  MailCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ResendLinkForm } from '@/components/resend-link-form'
import { StatusBadge } from '@/lib/status-labels'
import { serverFetch } from '@/lib/server-fetch'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ token: string }>
}

interface TrackingApplication {
  publicReference: string
  status: string
  submittedAt: string
  coverLetter?: string | null
  answers: Record<string, string>
  job: {
    title: string
    publicReference: string
    company: {
      legalName: string
      tradeName?: string | null
    }
  }
  statusHistory: Array<{
    toStatus: string
    publicMessage: string | null
    createdAt: string
  }>
}

export async function generateMetadata() {
  return { title: 'Suivi de candidature' }
}

export default async function TrackingPage({ params }: PageProps) {
  const { token } = await params
  const data = await serverFetch<TrackingApplication>(
    `/api/public/application-tracking/${token}`,
  )

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-lg">
          <Card>
            <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="size-8 text-amber-700" />
              </div>
              <h1 className="font-serif text-2xl font-bold">
                Lien invalide ou expiré
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Ce lien de suivi est invalide, a expiré ou a été révoqué. Pour des
                raisons de sécurité, les liens de suivi ont une durée de vie
                limitée. Vous pouvez en demander un nouveau ci-dessous.
              </p>
              <Separator className="my-2" />
              <div className="w-full text-left">
                <h2 className="mb-3 font-serif text-base font-semibold">
                  Demander un nouveau lien
                </h2>
                <ResendLinkForm />
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 text-center">
            <Button asChild variant="ghost">
              <Link href="/offres">
                <ArrowLeft className="size-4" />
                Retour aux offres
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const submittedAt = new Date(data.submittedAt)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-7 text-emerald-700" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Suivi de candidature</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Consultez ici l’état de votre candidature. Cette page est privée et
            accessible uniquement via votre lien personnel.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Statut actuel
              </span>
              <StatusBadge status={data.status} kind="application" />
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Référence
                </dt>
                <dd className="font-mono text-sm text-foreground">
                  {data.publicReference}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Date de soumission
                </dt>
                <dd className="inline-flex items-center gap-1.5 text-sm text-foreground">
                  <Clock className="size-3.5 text-primary" />
                  {format(submittedAt, "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Poste
                </dt>
                <dd className="text-foreground">
                  <span className="font-serif text-base font-semibold">
                    {data.job.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Réf. offre : <span className="font-mono">{data.job.publicReference}</span>
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Entreprise
                </dt>
                <dd className="inline-flex items-center gap-1.5 text-sm text-foreground">
                  <Building2 className="size-3.5 text-primary" />
                  {data.job.company.tradeName ?? data.job.company.legalName}
                </dd>
              </div>
            </dl>

            {data.coverLetter && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="size-4 text-accent" />
                    Votre lettre de motivation
                  </h3>
                  <div className="whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm leading-relaxed text-foreground/90">
                    {data.coverLetter}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* TIMELINE */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-serif text-lg">
              Historique de votre candidature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-5">
              {data.statusHistory.map((h, i) => {
                const date = new Date(h.createdAt)
                return (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1.5 size-2.5 rounded-full ${
                          i === 0 ? 'bg-primary' : 'bg-muted-foreground/40'
                        }`}
                      />
                      {i < data.statusHistory.length - 1 && (
                        <span className="mt-1 h-10 w-px bg-border" aria-hidden />
                      )}
                    </div>
                    <div className="pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={h.toStatus} kind="application" />
                        <span className="text-xs text-muted-foreground">
                          {format(date, "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                        </span>
                      </div>
                      {h.publicMessage && (
                        <p className="mt-1 text-sm text-foreground/80">
                          {h.publicMessage}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3 py-5">
            <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                Vous serez notifié·e à chaque évolution
              </p>
              <p className="mt-1 text-muted-foreground">
                Un e-mail vous sera envoyé à chaque changement de statut. Vous
                pouvez aussi consulter cette page à tout moment via votre lien
                privé. Conservez-le précieusement : il ne peut pas être régénéré
                sans votre e-mail et votre référence.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/offres">
              <ArrowLeft className="size-4" />
              Retour aux offres
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
