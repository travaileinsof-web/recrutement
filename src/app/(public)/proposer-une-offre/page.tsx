import Link from 'next/link'
import { Send, Clock, ShieldCheck, CheckCircle2, MailOpen, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmissionForm } from '@/components/submission-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Proposer une offre',
}

interface Step {
  icon: LucideIcon
  title: string
  text: string
}

const STEPS: Step[] = [
  {
    icon: Send,
    title: 'Vous soumettez votre offre',
    text: 'Remplissez le formulaire en quelques minutes. Aucun compte à créer, aucun engagement.',
  },
  {
    icon: Clock,
    title: 'Nous examinons votre proposition',
    text: 'Notre équipe revient vers vous sous 48h ouvrées pour valider, demander une correction ou refuser.',
  },
  {
    icon: CheckCircle2,
    title: 'Votre offre est publiée',
    text: 'Une fois validée, l’offre est mise en ligne. Vous êtes notifié par e-mail et recevez les candidatures centralisées.',
  },
  {
    icon: MailOpen,
    title: 'Vous recevez les candidatures',
    text: 'Les candidatures sont collectées de façon sécurisée. Notre équipe les transmet au contact que vous avez indiqué.',
  },
]

export default function ProposerPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent shadow-premium-xs">
          <span className="flex size-1.5 rounded-full bg-accent" />
          Pour les entreprises
        </span>
        <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Proposer une offre
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Vous recrutez ? Soumettez votre offre, notre équipe la valide puis la
          publie sur la plateforme. Aucun compte à créer, aucune commission.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* EXPLAINER SIDEBAR — premium timeline */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card className="overflow-hidden border-border/80 shadow-premium-sm">
            <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardHeader>
              <CardTitle className="font-serif text-lg font-semibold tracking-tight">
                Que se passe-t-il après l’envoi ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-1">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Vertical connector line */}
                    {i < STEPS.length - 1 && (
                      <span
                        className="absolute left-[18px] top-10 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-primary/30 to-transparent"
                        aria-hidden
                      />
                    )}
                    <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                      <s.icon className="size-4" strokeWidth={1.75} />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {s.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {s.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Trust callout */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/15 bg-secondary/40 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Vos données ne sont jamais revendues ni partagées en dehors de
              l’équipe TalentForge.
            </p>
          </div>

          <p className="mt-5 text-center text-sm">
            Besoin d’aide ?{' '}
            <Link href="/contact" className="font-medium text-primary transition-colors hover:text-accent">
              Contactez-nous
            </Link>
          </p>
        </aside>

        {/* FORM */}
        <div>
          <SubmissionForm />
        </div>
      </div>
    </div>
  )
}
