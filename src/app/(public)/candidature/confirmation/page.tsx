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
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="size-10 text-emerald-700" />
            </div>

            <h1 className="font-serif text-3xl font-bold">Candidature reçue</h1>

            <p className="max-w-md text-muted-foreground">
              Votre candidature a bien été enregistrée. Notre équipe l’examinera
              dans les plus brefs délais.
            </p>

            <div className="w-full rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Numéro de référence
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                {ref}
              </p>
            </div>

            <div className="w-full rounded-lg border border-border bg-card p-4 text-left">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Mail className="size-4 text-primary" />
                E-mail de confirmation envoyé
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Un e-mail contenant votre lien de suivi privé vient de vous être
                envoyé. Vérifiez votre dossier spam si vous ne le recevez pas.
                Ce lien vous permettra de consulter l’état de votre candidature à
                tout moment, sans création de compte.
              </p>
            </div>

            <div className="w-full rounded-lg border border-border bg-card p-4 text-left">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Eye className="size-4 text-primary" />
                Suivre ma candidature
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                Vous pouvez dès maintenant consulter l’état de votre candidature
                grâce à votre lien privé :
              </p>
              <Button asChild className="w-full gap-1.5">
                <Link href={`/suivi-candidature/${token}`}>
                  Accéder au suivi
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <Button asChild variant="outline">
              <Link href="/offres">Retour aux offres</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
