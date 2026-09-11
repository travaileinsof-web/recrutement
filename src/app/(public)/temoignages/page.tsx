import type { Metadata } from 'next'
import { HandwrittenSubtitle, DualActionButtons } from '@/components/premium-ui'

export const metadata: Metadata = {
  title: 'Témoignages | TalentForge',
  description: 'Ce que nos clients et candidats disent de TalentForge.',
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
              partagées
            </span>
          </h1>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-premium-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center font-serif text-xl font-bold text-primary">M</div>
                <div>
                  <div className="font-bold text-foreground">Mamadou B.</div>
                  <div className="text-sm text-muted-foreground">Directeur Financier</div>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "TalentForge a su comprendre nos exigences techniques et culturelles. Le recrutement de notre RAF s'est fait en un temps record avec des profils très qualifiés."
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-8 shadow-premium-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center font-serif text-xl font-bold text-accent">A</div>
                <div>
                  <div className="font-bold text-foreground">Aissatou D.</div>
                  <div className="text-sm text-muted-foreground">Développeuse Fullstack</div>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "J'ai postulé via la plateforme sans créer de compte. J'ai été rappelée le lendemain et accompagnée tout au long du processus. Une expérience candidate exceptionnelle."
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <DualActionButtons />
          </div>
        </div>
      </section>
    </div>
  )
}
