import type { Metadata } from 'next'
import { DualActionButtons, HandwrittenSubtitle } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Évaluation des Talents | TalentForge',
  description: 'Notre méthodologie d\'évaluation rigoureuse des candidats.',
}

export default function EvaluationPage() {
  return (
    <div className="flex flex-col">
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <HandwrittenSubtitle>L'exigence au coeur du processus</HandwrittenSubtitle>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            L'évaluation <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TalentForge
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Nous ne nous contentons pas de lire des CV. Nous évaluons les compétences techniques, le savoir-être et l'adéquation avec votre culture d'entreprise.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-12">
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">1. Entretiens Structurés</h3>
              <p className="text-muted-foreground">
                Chaque candidat pré-sélectionné passe un entretien structuré visant à évaluer ses réalisations passées et son potentiel.
              </p>
            </div>
            
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">2. Tests Techniques & Cas Pratiques</h3>
              <p className="text-muted-foreground">
                Selon le poste, nous soumettons les candidats à des tests de compétences ou des études de cas pour valider leur maîtrise opérationnelle.
              </p>
            </div>
            
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">3. Prise de Références</h3>
              <p className="text-muted-foreground">
                Nous vérifions systématiquement les références des finalistes auprès de leurs anciens employeurs pour sécuriser votre recrutement.
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <DualActionButtons 
              primaryText="Je recrute"
              primaryHref="/je-recrute"
              secondaryText="Consulter les offres"
              secondaryHref="/offres"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
