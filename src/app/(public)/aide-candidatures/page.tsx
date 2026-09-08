import Link from 'next/link'
import { ProsePage } from '@/components/prose-page'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata = { title: 'Aide & FAQ candidatures' }

const FAQ = [
  {
    q: 'Dois-je créer un compte pour postuler ?',
    a: 'Non. TalentForge fonctionne entièrement sans compte public. Vous postulez directement depuis la page de l’offre, en remplissant un formulaire unique. Vous recevez ensuite un lien privé par e-mail pour suivre votre candidature.',
  },
  {
    q: 'Comment suivre ma candidature ?',
    a: 'Après chaque dépôt, un e-mail vous est envoyé contenant un lien privé de suivi. Vous pouvez aussi demander un nouveau lien depuis la page « Suivi candidature » en fournissant votre e-mail et votre référence (APP-XXXX-XXXX).',
  },
  {
    q: 'Mon lien de suivi a expiré, que faire ?',
    a: 'Les liens de suivi ont une durée de vie de 30 jours par défaut. Rendez-vous sur la page « Suivi candidature », renseignez votre e-mail et votre référence : un nouveau lien vous sera envoyé si une candidature existe.',
  },
  {
    q: 'Quels formats de CV sont acceptés ?',
    a: 'Nous acceptons les fichiers PDF (.pdf) et Word (.docx). La taille maximum est de 10 Mo par fichier. Le CV est obligatoire, la lettre de motivation (texte ou fichier) est facultative.',
  },
  {
    q: 'Mes données sont-elles visibles par d’autres candidats ?',
    a: 'Jamais. Chaque candidature est strictement privée. Aucune autre personne que vous, l’équipe TalentForge et le recruteur en charge de l’offre ne peut y accéder.',
  },
  {
    q: 'Puis-je déposer plusieurs candidatures ?',
    a: 'Oui, mais une seule candidature par offre et par adresse e-mail est autorisée. Le système empêche les doublons (une candidature identique déposée plusieurs fois ne sera pas enregistrée).',
  },
  {
    q: 'Comment savoir si ma candidature a été reçue ?',
    a: 'Vous êtes automatiquement redirigé·e vers une page de confirmation affichant votre numéro de référence (APP-XXXX-XXXX). Vous recevez aussi un e-mail de confirmation. Pensez à vérifier votre dossier spam.',
  },
  {
    q: 'Puis-je modifier ma candidature après l’envoi ?',
    a: 'Pour des raisons de sécurité et de traçabilité, une candidature envoyée ne peut pas être modifiée. Si vous devez corriger une information importante, contactez-nous à contact@talentforge.local en indiquant votre référence.',
  },
  {
    q: 'Combien de temps ma candidature est-elle conservée ?',
    a: 'Vos données sont conservées 12 mois après la dernière mise à jour, conformément à notre politique de confidentialité. Vous pouvez demander leur suppression à tout moment.',
  },
  {
    q: 'Qui peut voir mon CV ?',
    a: 'Seules les personnes habilitées de l’équipe TalentForge et le contact entreprise désigné dans l’offre. Aucune URL publique ne permet d’accéder à votre CV.',
  },
]

export default function AideCandidaturesPage() {
  return (
    <ProsePage
      title="Aide & FAQ"
      description="Tout ce que vous devez savoir sur le parcours candidat sur TalentForge."
    >
      <p>
        Voici les questions les plus fréquemment posées par les candidats. Si
        votre question ne trouve pas réponse ci-dessous, n’hésitez pas à{' '}
        <Link href="/contact" className="text-primary hover:underline">nous contacter</Link>.
      </p>

      <div className="not-prose">
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-serif text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <h2>Vous ne trouvez pas votre réponse ?</h2>
      <p>
        Notre équipe est joignable à l’adresse{' '}
        <a href="mailto:contact@talentforge.local" className="text-primary hover:underline">contact@talentforge.local</a>{' '}
        ou via notre <Link href="/contact" className="text-primary hover:underline">formulaire de contact</Link>.
        Pour toute question relative à une candidature en cours, merci d’indiquer
        votre numéro de référence (APP-XXXX-XXXX).
      </p>
    </ProsePage>
  )
}
