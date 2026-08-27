import Link from 'next/link'
import { Send, Clock, ShieldCheck, CheckCircle2, MailOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmissionForm } from '@/components/submission-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Proposer une offre',
}

const STEPS = [
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
    <div className="container mx-auto px-4 py-10">
      <header className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Pour les entreprises
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">
          Proposer une offre
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Vous recrutez ? Soumettez votre offre, notre équipe la valide puis la
          publie sur la plateforme. Aucun compte à créer, aucune commission.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* EXPLAINER */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                Que se passe-t-il après l’envoi ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-5">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <s.icon className="size-4" />
                      </div>
                      {i < STEPS.length - 1 && (
                        <span className="mt-1 h-8 w-px bg-border" aria-hidden />
                      )}
                    </div>
                    <div className="pt-1">
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

          <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Vos données ne sont jamais revendues ni partagées en dehors de
              l’équipe TalentForge.
            </p>
          </div>

          <p className="mt-4 text-center text-sm">
            Besoin d’aide ?{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">
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
