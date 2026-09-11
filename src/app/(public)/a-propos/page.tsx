import type { Metadata } from 'next'
import { DualActionButtons, HandwrittenSubtitle, WhatsAppChip } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Notre Cabinet | TalentForge',
  description: 'Découvrez notre équipe et notre vision du recrutement à Conakry.',
}

export default function CabinetPage() {
  return (
    <div className="flex flex-col">
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <HandwrittenSubtitle>L'humain avant tout</HandwrittenSubtitle>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            Le cabinet qui repense <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              l'emploi en Guinée
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Nous sommes une équipe passionnée, dédiée à la mise en relation des meilleurs talents avec les entreprises les plus innovantes de la place de Conakry.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Notre Vision</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Trop souvent, le recrutement est perçu comme un processus lourd et opaque. Chez TalentForge, nous croyons en un recrutement transparent, rapide et centré sur l'expérience, tant pour le candidat que pour l'entreprise. 
          </p>
          <DualActionButtons 
            primaryText="Voir nos offres"
            primaryHref="/offres"
            secondaryText="Je recrute"
            secondaryHref="/je-recrute"
            className="justify-center"
          />
          <div className="mt-8">
            <WhatsAppChip />
          </div>
        </div>
      </section>
    </div>
  )
}
