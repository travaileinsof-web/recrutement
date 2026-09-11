import type { Metadata } from 'next'
import { DualActionButtons, HandwrittenSubtitle, StatCounter, WhatsAppChip } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Je recrute à Conakry | TalentForge',
  description: 'Confiez vos recrutements à TalentForge. Des profils vérifiés, un processus sans friction, une expertise locale en Guinée.',
}

export default function JeRecrutePage() {
  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <HandwrittenSubtitle>L'expertise locale</HandwrittenSubtitle>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            Trouvez les talents qui <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              feront grandir votre entreprise
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Nous combinons la rapidité d'une plateforme moderne avec la rigueur d'un cabinet de recrutement classique. Simplifiez votre processus et accédez aux meilleurs profils de Conakry.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <DualActionButtons 
              primaryText="Proposer une offre" 
              primaryHref="/proposer-une-offre"
              secondaryText="Discuter de mon besoin"
              secondaryHref="/contact"
              className="justify-center"
            />
            <div className="mt-4">
              <WhatsAppChip message="Bonjour, je souhaite vous confier un recrutement." />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">Notre méthode</span>
            <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight md:text-4xl text-foreground">
              Un recrutement sans friction
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary font-serif text-2xl font-bold shadow-premium-sm mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground">Définition du besoin</h3>
              <p className="mt-2 text-muted-foreground">
                Nous échangeons avec vous pour comprendre vos attentes, vos contraintes et votre culture d'entreprise.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary font-serif text-2xl font-bold shadow-premium-sm mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground">Sourcing & Évaluation</h3>
              <p className="mt-2 text-muted-foreground">
                Notre équipe identifie, qualifie et évalue les candidats à travers notre réseau et nos outils.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary font-serif text-2xl font-bold shadow-premium-sm mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground">Présentation & Choix</h3>
              <p className="mt-2 text-muted-foreground">
                Nous vous présentons une short-list des profils les plus pertinents. Vous n'avez plus qu'à choisir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <StatCounter value="95%" label="de réussite" />
            <StatCounter value="15" label="jours en moyenne" />
            <StatCounter value="50+" label="entreprises clientes" />
          </div>
        </div>
      </section>
    </div>
  )
}
