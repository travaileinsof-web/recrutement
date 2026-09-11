import type { Metadata } from 'next'
import { CheckCircle2, Zap, Shield, Search } from 'lucide-react'
import { DualActionButtons, HandwrittenSubtitle } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Tarifs et Options | TalentForge',
  description: 'Nos offres pour accélérer vos recrutements à Conakry. Paiement mobile money disponible.',
}

export default function TarifsPage() {
  return (
    <div className="flex flex-col">
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <HandwrittenSubtitle>Transparence totale</HandwrittenSubtitle>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            Des solutions adaptées <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              à vos besoins
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Publier une offre est 100% gratuit. Payez uniquement pour les options premium afin d'accélérer et sécuriser vos recrutements.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Card 1 */}
            <div className="relative flex flex-col rounded-3xl border border-border bg-card p-8 shadow-premium-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-foreground">Mise en avant</h3>
                <Zap className="size-6 text-accent" />
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">500 000</span>
                <span className="text-lg text-muted-foreground ml-2">GNF</span>
              </div>
              <p className="text-muted-foreground mb-8">
                Boostez la visibilité de votre offre pendant 15 jours sur notre page d'accueil et dans nos alertes.
              </p>
              <ul className="space-y-4 flex-1 mb-8">
                {['Top de liste pendant 15 jours', 'Mention "Urgent"', 'Relais sur nos réseaux', 'Notification prioritaire'].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-success" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors">
                Sélectionner
              </button>
            </div>

            {/* Card 2 - Premium */}
            <div className="relative flex flex-col rounded-3xl border border-primary/30 bg-primary/5 p-8 shadow-premium-lg scale-100 lg:scale-105 z-10">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">
                Le plus choisi
              </div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-foreground">Évaluation Technique</h3>
                <Shield className="size-6 text-primary" />
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">2 500 000</span>
                <span className="text-lg text-muted-foreground ml-2">GNF</span>
                <span className="text-sm text-muted-foreground block mt-1">par candidat</span>
              </div>
              <p className="text-muted-foreground mb-8">
                Laissez-nous évaluer les compétences techniques et le savoir-être de vos finalistes.
              </p>
              <ul className="space-y-4 flex-1 mb-8">
                {['Test technique sur mesure', 'Entretien de 45 minutes', 'Vérification des références', 'Rapport détaillé d\'évaluation', 'Recommandation objective'].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-premium-sm">
                Sélectionner
              </button>
            </div>

            {/* Card 3 */}
            <div className="relative flex flex-col rounded-3xl border border-border bg-card p-8 shadow-premium-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-foreground">Accès CVthèque</h3>
                <Search className="size-6 text-muted-foreground" />
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">Sur devis</span>
              </div>
              <p className="text-muted-foreground mb-8">
                Accédez à notre base de données de talents pré-qualifiés et sourcez vous-même vos futurs collaborateurs.
              </p>
              <ul className="space-y-4 flex-1 mb-8">
                {['Accès illimité pendant 30j', 'Filtres avancés', 'Contact direct avec les candidats', 'Statistiques de marché'].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-border bg-transparent text-foreground font-semibold hover:bg-muted transition-colors">
                Nous contacter
              </button>
            </div>

          </div>

          {/* Payment Methods */}
          <div className="mt-20 text-center border-t border-border pt-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Paiements sécurisés 100% locaux
            </p>
            <div className="flex items-center justify-center gap-8 opacity-70 grayscale transition-all hover:grayscale-0">
              <div className="font-bold text-xl text-[#FF6600]">Orange Money</div>
              <div className="font-bold text-xl text-[#FFCC00]">MTN MoMo</div>
              <div className="font-bold text-xl text-[#0066CC]">PayCard</div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  )
}
