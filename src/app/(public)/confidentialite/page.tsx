import { ProsePage } from '@/components/prose-page'

export const metadata = { title: 'Politique de confidentialité' }

export default function ConfidentialitePage() {
  return (
    <ProsePage
      title="Politique de confidentialité"
      description="Conforme au RGPD. Cette page décrit comment TalentForge collecte, utilise et protège vos données."
    >
      <p>
        TalentForge est éditée en Guin�e. La présente politique de
        confidentialité décrit la manière dont nous collectons, traitons,
        conservons et protégeons les données personnelles des utilisateurs de
        notre plateforme, conformément au Règlement Général sur la Protection
        des Données (RGPD) et à la Loi Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données est l’équipe interne
        TalentForge, joignable à l’adresse{' '}
        <a href="mailto:contact@talentforge.gn">contact@talentforge.gn</a>.
        Aucun sous-traitant tiers n’a accès à vos données personnelles en dehors
        de notre infrastructure d’hébergement.
      </p>

      <h2>Données collectées</h2>
      <h3>Lors d’une candidature</h3>
      <ul>
        <li>Votre nom, prénom et coordonnées (e-mail, téléphone facultatif, ville facultative) ;</li>
        <li>Votre CV et, le cas échéant, votre lettre de motivation (fichier et/ou texte) ;</li>
        <li>L’identifiant de l’offre à laquelle vous postulez ;</li>
        <li>Une marque temporelle et une empreinte technique (adresse IP hachée, user-agent) à des fins de sécurité et de prévention anti-robot.</li>
      </ul>

      <h3>Lors d’une proposition d’offre (entreprises)</h3>
      <ul>
        <li>Les informations sur l’entreprise (raison sociale, secteur, coordonnées) ;</li>
        <li>Les coordonnées du contact RH soumettant l’offre ;</li>
        <li>Le contenu de l’offre proposée (titre, description, critères).</li>
      </ul>

      <h2>Finalités du traitement</h2>
      <ul>
        <li>Permettre la soumission et l’examen des candidatures ;</li>
        <li>Permettre la modération et la publication des offres proposées par les entreprises ;</li>
        <li>Vous informer de l’évolution de votre candidature via un lien de suivi privé et des notifications par e-mail ;</li>
        <li>Prévenir les abus (rate limiting, anti-robot, journalisation des actions sensibles).</li>
      </ul>

      <h2>Base légale</h2>
      <p>
        Le traitement repose sur votre consentement explicite (case à cocher
        obligatoire au moment de la soumission) pour la candidature, et sur
        notre intérêt légitime à instruire les propositions d’offres et à
        assurer la sécurité de la plateforme.
      </p>

      <h2>Durée de conservation</h2>
      <ul>
        <li>Candidatures et fichiers joints : 12 mois après la dernière mise à jour ;</li>
        <li>Liens de suivi privés : 30 jours par défaut (renouvelable sur demande) ;</li>
        <li>Journal d’audit : 24 mois ;</li>
        <li>Soumissions d’offres non publiées : 6 mois.</li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        Les données ne sont accessibles qu’aux administrateurs internes
        TalentForge et, le cas échéant, au contact entreprise désigné dans
        l’offre à laquelle vous avez postulé. Aucune donnée n’est revendue ni
        partagée à des tiers à des fins commerciales.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d’un droit d’accès, de
        rectification, d’effacement, d’opposition, à la limitation et à la
        portabilité de vos données. Pour les exercer, écrivez-nous à{' '}
        <a href="mailto:contact@talentforge.gn">contact@talentforge.gn</a>{' '}
        en indiquant votre référence de candidature ou l’e-mail utilisé. Nous
        répondons sous 30 jours maximum.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les CV et lettres de motivation sont stockés dans un emplacement privé
        non accessible publiquement. Aucune URL publique ne permet de
        télécharger un fichier. L’accès aux candidatures se fait exclusivement
        via un tableau de bord administrateur authentifié. Toutes les actions
        sensibles sont consignées dans un journal d’audit append-only.
      </p>

      <h2>Cookies</h2>
      <p>
        TalentForge n’utilise pas de cookies de tracking publicitaire. La
        plateforme utilise uniquement un cookie de session technique pour
        l’espace d’administration interne. Pour plus d’informations, consultez
        notre <a href="/cookies">politique de cookies</a>.
      </p>

      <h2>Mise à jour</h2>
      <p>
        Version 1.0.0 — Cette politique peut être mise à jour à tout moment.
        Toute modification significative vous sera notifiée par e-mail si vous
        avez une candidature en cours.
      </p>
    </ProsePage>
  )
}

