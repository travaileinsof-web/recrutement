import Link from 'next/link'
import { ArrowRight, Briefcase, Building2, Send, Search, Eye, FileText, Users, Sparkles, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { JobCard } from '@/components/job-card'
import { serverFetch } from '@/lib/server-fetch'
import type { PaginatedJobs } from '@/lib/types'

const CATEGORIES = [
  { name: 'Ingénierie', description: 'R&D, systèmes embarqués, robotique', icon: '⚙️' },
  { name: 'Énergie', description: 'ENR, maintenance, exploitation', icon: '⚡' },
  { name: 'Design', description: 'UX/UI, produit, brand', icon: '🎨' },
  { name: 'Développement', description: 'Front, back, full-stack, DevOps', icon: '💻' },
  { name: 'Maintenance', description: 'Techniciens, astreintes, terrain', icon: '🛠️' },
  { name: 'Stage', description: 'Première expérience, alternance', icon: '🎓' },
]

const HOW_IT_WORKS = [
  {
    icon: Eye,
    title: 'Pour les candidats',
    text: 'Consultez les offres, postulez en 3 minutes sans créer de compte. Votre CV reste privé. Vous suivez votre candidature avec un lien personnel.',
  },
  {
    icon: Send,
    title: 'Pour les entreprises',
    text: 'Proposez une offre en remplissant un formulaire. Notre équipe la valide, la publie, puis centralise les candidatures pour vous.',
  },
  {
    icon: ShieldCheck,
    title: 'Pour les recruteurs internes',
    text: 'Tableau de bord centralisé : validation des offres, suivi des candidatures, statuts, fichiers, journal d’audit complet.',
  },
]

export const dynamic = 'force-dynamic'

async function fetchJobs() {
  return serverFetch<PaginatedJobs>('/api/public/jobs?pageSize=6&page=1')
}

export default async function HomePage() {
  const jobs = (await fetchJobs()) ?? { items: [], total: 0, page: 1, pageSize: 6, totalPages: 0 }
  const totalJobs = jobs.total ?? 0

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary/60 via-background to-background">
        <div className="absolute inset-0 -z-10 opacity-50" aria-hidden>
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 size-72 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="size-3.5 text-accent" />
              Sans compte public. Sans intermédiaire. Sans friction.
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Recrutez sans friction.
              <br />
              <span className="text-primary">Candidatez sans compte.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              TalentForge met en relation entreprises et talents sans jamais exiger
              la création d’un compte public. Publiez une offre ou postulez en
              quelques minutes, en toute confidentialité.
            </p>

            {/* Search bar */}
            <form
              action="/offres"
              method="GET"
              className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  name="search"
                  aria-label="Rechercher une offre"
                  placeholder="Métier, mot-clé, compétence…"
                  className="h-10 w-full rounded-md bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" size="lg" className="gap-1.5">
                <Search className="size-4" />
                <span className="hidden sm:inline">Rechercher</span>
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="outline">
                <Link href="/offres">
                  <Briefcase className="size-4" />
                  Voir les offres
                </Link>
              </Button>
              <Button asChild size="lg" variant="default">
                <Link href="/proposer-une-offre">
                  <Send className="size-4" />
                  Proposer une offre
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-card" aria-label="Chiffres clés">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          <StatCard
            icon={Briefcase}
            value={String(totalJobs)}
            label="Offres publiées"
          />
          <StatCard icon={Building2} value="4" label="Entreprises partenaires" />
          <StatCard icon={FileText} value="0" label="Candidatures traitées" />
          <StatCard icon={Users} value="100%" label="Confidentialité des données" />
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="container mx-auto px-4 py-14 md:py-20" aria-labelledby="featured-jobs-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured-jobs-title" className="font-serif text-3xl font-bold text-foreground">
              Offres à la une
            </h2>
            <p className="mt-2 text-muted-foreground">
              Une sélection d’opportunités publiées par nos entreprises partenaires.
            </p>
          </div>
          <Button asChild variant="ghost" className="gap-1.5 text-primary">
            <Link href="/offres">
              Toutes les offres
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {jobs.items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucune offre publiée pour le moment. Revenez bientôt !
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-secondary/30 py-14 md:py-20" aria-labelledby="how-title">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="how-title" className="font-serif text-3xl font-bold">
              Comment ça marche
            </h2>
            <p className="mt-3 text-muted-foreground">
              Trois parcours pensés pour la simplicité, sans aucun compte à créer.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.title} className="h-full">
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <CardTitle className="mt-3 font-serif text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.text}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-14 md:py-20" aria-labelledby="categories-title">
        <div className="mb-8">
          <h2 id="categories-title" className="font-serif text-3xl font-bold">
            Explorer par catégorie
          </h2>
          <p className="mt-2 text-muted-foreground">
            Trouvez rapidement une offre dans votre domaine.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/offres?category=${encodeURIComponent(cat.name)}`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <span className="text-3xl" aria-hidden>
                {cat.icon}
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </div>
              <ArrowRight className="ml-auto size-4 self-center text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-14 text-center md:py-20">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-bold md:text-4xl">
            Prêt à publier votre offre ou à postuler ?
          </h2>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Aucune création de compte. Aucun engagement. Vous gardez le contrôle
            total de vos données à chaque étape.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href="/proposer-une-offre">
                <Send className="size-4" />
                Proposer une offre
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/offres">
                <Briefcase className="size-4" />
                Voir les offres
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-serif text-3xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
