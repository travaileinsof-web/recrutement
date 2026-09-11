import { ProsePage } from '@/components/prose-page'

export const metadata = { title: 'Conditions d’utilisation' }

export default function ConditionsPage() {
  return (
    <ProsePage
      title="Conditions d’utilisation"
      description="Les présentes conditions encadrent l’utilisation de la plateforme TalentForge par les candidats et les entreprises externes."
    >
      <h2>Objet</h2>
      <p>
        TalentForge est une plateforme de mise en relation entre entreprises
        externes proposant des offres d’emploi et candidats souhaitant postuler
        sans création de compte public. La plateforme est exploitée par une
        équipe interne qui valide chaque offre avant publication.
      </p>

      <h2>Acceptation</h2>
      <p>
        L’utilisation de la plateforme implique l’acceptation pleine et
        entière des présentes conditions. Le consentement est recueilli au
        moment de chaque soumission (candidature ou proposition d’offre) via
        une case à cocher obligatoire.
      </p>

      <h2>Accès à la plateforme</h2>
      <p>
        L’accès aux offres publiques est libre et gratuit, sans inscription.
        La soumission d’une candidature ou d’une proposition d’offre est
        également libre et gratuite. Aucun compte public n’est requis.
        L’espace d’administration est strictement réservé aux équipes internes
        TalentForge.
      </p>

      <h2>Engagements du candidat</h2>
      <ul>
        <li>Ne soumettre que des informations exactes et à jour ;</li>
        <li>Ne postuler qu’à des offres correspondant réellement à son profil ;</li>
        <li>Ne pas tenter d’accéder aux données d’autres candidats ;</li>
        <li>Ne pas utiliser de moyens automatisés (bots, scripts) pour soumettre des candidatures.</li>
      </ul>

      <h2>Engagements de l’entreprise</h2>
      <ul>
        <li>Soumettre des offres conformes à la réglementation guinéenne du travail ;</li>
        <li>Garantir l’exactitude des informations fournies ;</li>
        <li>Respecter les candidats et répondre dans des délais raisonnables ;</li>
        <li>Ne pas demander aux candidats d’informations sensibles (religion, santé, orientation sexuelle, etc.) en dehors des cas légalement autorisés.</li>
      </ul>

      <h2>Modération</h2>
      <p>
        Toute proposition d’offre est examinée par notre équipe avant
        publication. Nous nous réservons le droit de refuser, de demander des
        corrections ou de supprimer une offre ne respectant pas nos critères
        éditoriaux ou la réglementation. Aucune offre n’est publiée
        automatiquement.
      </p>

      <h2>Responsabilité</h2>
      <p>
        TalentForge agit en qualité d’hébergeur et de tiers de confiance pour
        la mise en relation. Nous ne saurions être tenus responsables du
        contenu des offres, du comportement des entreprises ou des candidats.
        Tout litige relève de la responsabilité des parties concernées.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        La marque, le logo et les éléments graphiques de TalentForge sont protégés.
        Le contenu des offres reste la propriété des entreprises qui les soumettent.
        Les candidats conservent la propriété de leur CV et de leur lettre de
        motivation ; ils autorisent TalentForge à les stocker et à les transmettre
        uniquement dans le cadre du processus de recrutement correspondant.
      </p>

      <h2>Suppression et droit à l’oubli</h2>
      <p>
        Vous pouvez à tout moment demander la suppression de vos données en
        écrivant à{' '}
        <a href="mailto:contact@talentforge.gn">contact@talentforge.gn</a>.
        Les offres publiées ayant déjà reçu des candidatures ne sont pas
        supprimées physiquement mais archivées afin de préserver la traçabilité.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes conditions sont régies par le droit guinéen. Tout litige
        relèvera de la compétence des tribunaux guinéens.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative aux présentes conditions, contactez-nous à
        l’adresse{' '}
        <a href="mailto:contact@talentforge.gn">contact@talentforge.gn</a>.
      </p>
    </ProsePage>
  )
}

