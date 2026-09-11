import { Target, Heart, Users, Compass, Sparkles } from 'lucide-react'
import { ProsePage } from '@/components/prose-page'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = { title: 'À propos' }

const VALUES = [
  {
    icon: Target,
    title: 'Simplicité',
    text: 'Pas de comptes, pas de mot de passe oublié, pas de profil à remplir. Le bon candidat au bon poste, sans friction.',
  },
  {
    icon: Heart,
    title: 'Respect',
    text: 'Vos données vous appartiennent. Elles ne sont jamais revendues ni partagées en dehors du strict nécessaire au processus de recrutement.',
  },
  {
    icon: Users,
    title: 'Équité',
    text: 'Toutes les candidatures sont traitées de la même manière. Le suivi est transparent et chaque décision est tracée.',
  },
  {
    icon: Compass,
    title: 'Transparence',
    text: 'Le statut de chaque candidature est visible à tout moment par le candidat, via un lien privé et personnel.',
  },
]

export default function AboutPage() {
  return (
    <ProsePage
      title="À propos de TalentForge"
      description="La plateforme de recrutement qui simplifie la mise en relation entre entreprises et talents, sans jamais demander de compte."
    >
      <p>
        TalentForge est une plateforme de recrutement guinéenne née d’un
        constat simple : la plupart des sites d’emploi imposent aux candidats
        comme aux entreprises de créer un compte, de remplir des profils
        interminables, puis de subir un quotidien fait d’e-mails non sollicités
        et d’offres hors sujet. Nous avons voulu construire l’inverse.
      </p>

      <p>
        Notre conviction est qu’un bon processus de recrutement n’a pas besoin
        d’être intrusif. Le candidat consulte les offres, postule en quelques
        minutes à celle qui lui correspond, puis suit sa candidature avec un lien
        privé. L’entreprise soumet son offre via un formulaire unique et reçoit
        les candidatures centralisées. Notre équipe interne valide chaque offre
        avant publication pour garantir la qualité et la pertinence du contenu
        proposé aux candidats.
      </p>

      <p>
        Aucune création de compte n’est demandée aux candidats ni aux
        entreprises externes. Seuls les administrateurs internes de TalentForge
        disposent d’un accès authentifié, exclusivement dédié à la modération, à
        la validation et au suivi des dossiers.
      </p>

      <h2>Nos valeurs</h2>
      <div className="grid gap-4 sm:grid-cols-2 not-prose">
        {VALUES.map((v) => (
          <Card key={v.title}>
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <v.icon className="size-5" />
              </div>
              <h3 className="font-serif text-base font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2>Notre équipe</h2>
      <p>
        TalentForge est animée par une petite équipe pluridisciplinaire
        passionnée par l’expérience candidat et la qualité des offres publiées.
        Notre rôle quotidien consiste à examiner les propositions d’offres
        soumises par les entreprises, à valider leur conformité, à accompagner
        les recruteurs externes dans la rédaction, puis à centraliser et
        transmettre les candidatures dans le respect de la confidentialité.
      </p>
      <p>
        Nous opérons une modération humaine systématique : aucune offre n’est
        mise en ligne sans avoir été relue. Chaque décision est tracée dans un
        journal d’audit consultable par notre équipe, et chaque interaction est
        consignée à des fins de transparence et de redevabilité.
      </p>

      <blockquote>
        <Sparkles className="mr-2 inline size-4 text-accent" />
        Recrutez sans friction. Candidatez sans compte. Voilà toute notre
        promesse.
      </blockquote>
    </ProsePage>
  )
}

