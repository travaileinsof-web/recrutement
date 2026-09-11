import type { Metadata } from 'next'
import Link from 'next/link'
import { HandwrittenSubtitle } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Fiches Métiers | TalentForge',
  description: 'Découvrez les métiers les plus recherchés à Conakry.',
}

export default function FichesMetiersPage() {
  const metiers = [
    { slug: 'responsable-administratif-et-financier', title: 'Responsable Administratif et Financier (RAF)', sector: 'Finance' },
    { slug: 'developpeur-fullstack', title: 'Développeur Fullstack', sector: 'IT & Digital' },
    { slug: 'commercial-b2b', title: 'Commercial B2B', sector: 'Vente' },
  ]

  return (
    <div className="flex flex-col min-h-[70vh]">
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <HandwrittenSubtitle>Guide des carrières</HandwrittenSubtitle>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            Fiches Métiers
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Explorez les opportunités, les salaires et les compétences attendues pour les postes clés du marché guinéen.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metiers.map(m => (
              <Link key={m.slug} href={`/fiches-metiers/${m.slug}`} className="block group">
                <div className="bg-card border border-border p-6 rounded-xl shadow-premium-xs transition-all hover:border-primary/30 hover:shadow-premium-lg hover:-translate-y-1 h-full">
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">{m.sector}</div>
                  <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
