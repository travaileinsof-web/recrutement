import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, Mail, Eye, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ ref?: string; token?: string }>
}

export async function generateMetadata() {
  return { title: 'Candidature reçue' }
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const ref = sp.ref
  const token = sp.token

  if (!ref || !token) {
    redirect('/')
  }

  return (
    <div className="relative overflow-hidden bg-texture-subtle py-16 md:py-24">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -right-32 top-0 size-96 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute -left-32 bottom-0 size-96 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl">
          <Card className="overflow-hidden border-border/80 shadow-premium-lg">
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
              {/* Success icon — refined */}
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-100/60 blur-md" aria-hidden />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-200">
                  <CheckCircle2 className="size-8 text-emerald-600" strokeWidth={1.75} />
                </div>
              </div>

              {/* Portrait of satisfied candidate — premium with ring */}
              <div className="relative size-20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-md" aria-hidden />
                <div className="relative size-full overflow-hidden rounded-full ring-2 ring-white shadow-premium">
                  <img
                    src="/images/people/candidate-woman.png"
                    alt="Candidate noire africaine souriante"
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Confirmation
                </span>
                <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight md:text-4xl">
                  Candidature reçue
                </h1>
              </div>

              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                Votre candidature a bien été enregistrée. Notre équipe l’examinera
                dans les plus brefs délais.
              </p>

              {/* Reference — premium styled box */}
              <div className="w-full rounded-xl border border-border bg-gradient-to-br from-secondary/60 to-secondary/20 p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Numéro de référence
                </p>
                <p className="mt-1.5 font-mono text-xl font-bold tracking-tight text-foreground">
                  {ref}
                </p>
              </div>

              {/* Email confirmation block */}
              <div className="w-full rounded-xl border border-border bg-card p-5 text-left">
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-4" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    E-mail de confirmation envoyé
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Un e-mail contenant votre lien de suivi privé vient de vous être
                  envoyé. Vérifiez votre dossier spam si vous ne le recevez pas.
                  Ce lien vous permettra de consulter l’état de votre candidature à
                  tout moment, sans création de compte.
                </p>
              </div>

              {/* Tracking link block */}
              <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-5 text-left">
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Eye className="size-4" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Suivre ma candidature
                  </p>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  Vous pouvez dès maintenant consulter l’état de votre candidature
                  grâce à votre lien privé :
                </p>
                <Button asChild className="w-full gap-2">
                  <Link href={`/suivi-candidature/${token}`}>
                    Accéder au suivi
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </Link>
                </Button>
              </div>

              <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Link href="/offres">Retour aux offres</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
