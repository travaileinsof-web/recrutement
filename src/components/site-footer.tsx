import Link from 'next/link'
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Plateforme',
    links: [
      { href: '/offres', label: 'Offres d\'emploi' },
      { href: '/je-recrute', label: 'Je recrute' },
      { href: '/suivi-candidature', label: 'Suivre ma candidature' },
      { href: '/fiches-metiers', label: 'Fiches Métiers' },
      { href: '/tarifs', label: 'Tarifs & Options' },
    ],
  },
  {
    title: 'Le Cabinet',
    links: [
      { href: '/a-propos', label: 'Le Cabinet' },
      { href: '/evaluation', label: 'Notre évaluation' },
      { href: '/temoignages', label: 'Témoignages' },
      { href: '/blog', label: 'Blog & Actualités' },
    ],
  },
  {
    title: 'Légal & Contact',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: '/confidentialite', label: 'Confidentialité (RGPD)' },
      { href: '/conditions', label: 'CGU' },
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Accueil TalentForge">
              <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-premium-sm transition-transform group-hover:scale-105">
                <span className="font-serif text-lg font-bold leading-none">T</span>
              </span>
              <span className="font-serif text-xl font-bold tracking-tight">TalentForge</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              La plateforme de recrutement sans friction.
              Recrutez sans intermédiaire, candidatez sans créer de compte.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary" strokeWidth={1.75} />
                <a href="mailto:contact@talentforge.gn" className="transition-colors hover:text-foreground">
                  contact@talentforge.gn
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-primary" strokeWidth={1.75} />
                <span>+224 620 00 00 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-primary" strokeWidth={1.75} />
                <span>Conakry, Guin�e</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                {col.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Admin block */}
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Espace administration
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Réservé aux équipes internes TalentForge. Authentification requise.
            </p>
            <Link
              href="/admin/login"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              Connexion administrateur
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} TalentForge. Tous droits réservés.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            Aucune création de compte public. Vos données restent privées.
          </p>
        </div>
      </div>
    </footer>
  )
}

