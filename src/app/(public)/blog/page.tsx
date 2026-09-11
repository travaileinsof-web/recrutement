import type { Metadata } from 'next'
import { HandwrittenSubtitle } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Blog | TalentForge',
  description: 'Actualités, conseils recrutement et tendances de l\'emploi à Conakry.',
}

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-[70vh]">
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <HandwrittenSubtitle>Le journal</HandwrittenSubtitle>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            Blog & Actualités
          </h1>
        </div>
      </section>

      <section className="py-20 bg-background flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-xl">Bientôt disponible.</p>
          <p className="mt-2">Nos premiers articles sont en cours de rédaction.</p>
        </div>
      </section>
    </div>
  )
}
