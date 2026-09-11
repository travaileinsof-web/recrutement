import type { Metadata } from 'next'
import { HandwrittenSubtitle, DualActionButtons } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Témoignages & Études de cas | TalentForge',
  description: 'Découvrez comment nos clients accélèrent leurs recrutements avec nos solutions.',
}

export default function TemoignagesPage() {
  return (
    <div className="flex flex-col">
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <HandwrittenSubtitle>Ils nous font confiance</HandwrittenSubtitle>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            Des réussites <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              chiffrées
            </span>
          </h1>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-12">
            
            {/* Business Case 1 */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-premium-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="font-serif text-9xl font-bold">1</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Étude de cas
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">Secteur Bancaire</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-foreground mb-4">
                  Recrutement d'un Directeur Financier
                </h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
                  Une banque panafricaine basée à Conakry cherchait à remplacer son DAF en urgence. En utilisant l'option "Évaluation Technique", nous avons audité 12 profils.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border mb-8">
                  <div>
                    <div className="text-3xl font-bold text-foreground">14</div>
                    <div className="text-sm text-muted-foreground mt-1">Jours (Délai)</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">100%</div>
                    <div className="text-sm text-muted-foreground mt-1">Rétention (6 mois)</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">3</div>
                    <div className="text-sm text-muted-foreground mt-1">Entretiens utiles</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center font-serif text-xl font-bold text-primary shrink-0">M</div>
                  <p className="text-sm text-foreground italic">
                    "La grille d'évaluation technique fournie par TalentForge nous a fait gagner 3 semaines de process interne."
                  </p>
                </div>
              </div>
            </div>

            {/* Business Case 2 */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-premium-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="font-serif text-9xl font-bold">2</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Étude de cas
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">Tech & Digital</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-foreground mb-4">
                  Formation d'une escouade de Développeurs
                </h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
                  Une startup fintech devait recruter 4 développeurs (Front & Back) pour lancer sa V2. Via l'accès direct CVthèque et les "Offres à la une", la cible a été atteinte.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border mb-8">
                  <div>
                    <div className="text-3xl font-bold text-foreground">22</div>
                    <div className="text-sm text-muted-foreground mt-1">Jours (Total)</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">4/4</div>
                    <div className="text-sm text-muted-foreground mt-1">Postes pourvus</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">-40%</div>
                    <div className="text-sm text-muted-foreground mt-1">Coût d'acquisition</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border">
                  <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center font-serif text-xl font-bold text-accent shrink-0">I</div>
                  <p className="text-sm text-foreground italic">
                    "Ne pas obliger les devs à créer un compte pour postuler a multiplié par 3 notre taux de conversion de candidatures."
                  </p>
                </div>
              </div>
            </div>

          </div>
          
          <div className="mt-16 flex justify-center">
            <DualActionButtons 
              primaryText="Découvrir nos tarifs"
              primaryHref="/tarifs"
              secondaryText="Proposer une offre"
              secondaryHref="/proposer-une-offre"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
