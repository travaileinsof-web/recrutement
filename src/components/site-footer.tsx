import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Plateforme',
    links: [
      { href: '/offres', label: 'Offres d’emploi' },
      { href: '/proposer-une-offre', label: 'Proposer une offre' },
      { href: '/suivi-candidature', label: 'Suivre ma candidature' },
      { href: '/aide-candidatures', label: 'Aide & FAQ' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { href: '/a-propos', label: 'À propos' },
      { href: '/contact', label: 'Contact' },
      { href: '/confidentialite', label: 'Confidentialité (RGPD)' },
      { href: '/conditions', label: 'Conditions d’utilisation' },
      { href: '/cookies', label: 'Cookies' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif text-lg font-bold">
                T
              </span>
              <span className="font-serif text-xl font-bold">TalentForge</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              La plateforme de recrutement sans friction.
              Recrutez sans intermédiaire, candidatez sans créer de compte.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <a href="mailto:contact@talentforge.local" className="hover:text-foreground">
                  contact@talentforge.local
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <span>+33 1 84 80 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>

          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Espace administration
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Réservé aux équipes internes TalentForge.
            </p>
            <Link
              href="/admin/login"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Connexion administrateur →
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} TalentForge. Tous droits réservés.
          </p>
          <p>
            Aucune création de compte public. Vos données restent privées.
          </p>
        </div>
      </div>
    </footer>
  )
}
