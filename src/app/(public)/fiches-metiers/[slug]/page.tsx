import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DualActionButtons } from '@/components/premium-ui'

export default async function FicheMetierDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Fake data for now
  if (!slug) notFound()

  const formatTitle = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="flex flex-col">
      <section className="aurora-bg noise-overlay relative overflow-hidden border-b border-border py-20">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link href="/fiches-metiers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="size-4" />
            Retour aux fiches métiers
          </Link>
          <div className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">Fiche Métier</div>
          <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl text-foreground">
            {formatTitle(slug)}
          </h1>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-slate dark:prose-invert lg:prose-lg">
            <p>
              Le poste de {formatTitle(slug)} est stratégique au sein des entreprises en pleine croissance à Conakry.
            </p>
            <h3>Missions principales</h3>
            <ul>
              <li>Pilotage et supervision des activités</li>
              <li>Accompagnement et conseil auprès de la direction</li>
              <li>Mise en place de processus optimisés</li>
            </ul>
            <h3>Compétences requises</h3>
            <ul>
              <li>Excellente capacité d'analyse</li>
              <li>Leadership et esprit d'équipe</li>
              <li>Maîtrise des outils métiers</li>
            </ul>
            <h3>Rémunération moyenne (Conakry)</h3>
            <p>Entre 8 000 000 et 25 000 000 GNF net mensuel selon l'expérience et la taille de l'entreprise.</p>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex justify-center">
            <DualActionButtons 
              primaryText="Voir les offres liées"
              primaryHref={`/offres?search=${slug.split('-')[0]}`}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
