import { ProsePage } from '@/components/prose-page'

export const metadata = { title: 'Politique de cookies' }

export default function CookiesPage() {
  return (
    <ProsePage
      title="Politique de cookies"
      description="TalentForge s’engage à minimiser l’usage de cookies et autres traceurs."
    >
      <p>
        Cette politique vous informe sur l’utilisation des cookies et traceurs
        sur la plateforme TalentForge. Nous appliquons une politique de
        minimalité : nous n’utilisons que les traceurs strictement nécessaires
        au fonctionnement technique de la plateforme.
      </p>

      <h2>Qu’est-ce qu’un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre terminal lors de
        la visite d’un site web. Il permet au site de mémoriser certaines
        informations relatives à votre visite.
      </p>

      <h2>Cookies utilisés par TalentForge</h2>
      <ul>
        <li>
          <strong>Cookie de session administrateur</strong> : il est déposé
          uniquement lorsque vous vous connectez à l’espace d’administration
          interne. Il est strictement technique, httpOnly, sécurisé, et expiré
          automatiquement après 12 heures. Il ne contient aucune donnée
          personnelle identifiable en clair.
        </li>
        <li>
          <strong>Aucun cookie publicitaire</strong> : nous n’utilisons pas de
          cookies de ciblage publicitaire ni de retargeting.
        </li>
        <li>
          <strong>Aucun cookie analytique tiers</strong> : nous n’utilisons pas
          Google Analytics ni aucune solution d’analyse tierce.
        </li>
      </ul>

      <h2>Traceurs techniques</h2>
      <p>
        La plateforme utilise un mécanisme de limitation de débit (rate
        limiting) en mémoire serveur pour prévenir les abus. Cette fonction
        repose sur votre adresse IP, qui est hachée avant tout stockage dans
        le journal d’audit. L’IP n’est jamais conservée en clair.
      </p>

      <h2>Stockage local de votre navigateur</h2>
      <p>
        Aucune donnée n’est stockée dans le localStorage ou le sessionStorage
        de votre navigateur. Le token de suivi de candidature est transmis
        uniquement via l’URL et n’est jamais conservé côté navigateur.
      </p>

      <h2>Vos choix</h2>
      <p>
        Vous pouvez à tout moment configurer votre navigateur pour bloquer les
        cookies. Le seul impact est que la connexion administrateur ne
        fonctionnera pas — ce qui n’affecte pas les utilisateurs publics de la
        plateforme.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Le cookie de session administrateur expire au bout de 12 heures
        d’inactivité, ou dès que l’administrateur se déconnecte explicitement.
        Aucun cookie persistant n’est déposé.
      </p>

      <h2>Mise à jour</h2>
      <p>
        Cette politique peut évoluer. En cas de modification significative,
        nous l’indiquerons clairement sur la page d’accueil. Dernière mise à
        jour : version 1.0.0.
      </p>
    </ProsePage>
  )
}
