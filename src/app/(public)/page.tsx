import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Send,
  Search,
  Eye,
  FileText,
  Users,
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap,
  Palette,
  Code2,
  Wrench,
  GraduationCap,
  CheckCircle2,
  Lock,
  Mail,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { JobCard } from '@/components/job-card'
import { serverFetch } from '@/lib/server-fetch'
import type { PaginatedJobs } from '@/lib/types'

// Premium icon set (replaces emojis) — lucide-react, consistent line weight
type Category = {
  name: string
  description: string
  icon: LucideIcon
  count?: string
}

const CATEGORIES: Category[] = [
  { name: 'Ingénierie', description: 'R&D, systèmes embarqués, robotique', icon: Cpu, count: 'R&D' },
  { name: 'Énergie', description: 'ENR, maintenance, exploitation', icon: Zap, count: 'ENR' },
  { name: 'Design', description: 'UX/UI, produit, brand', icon: Palette, count: 'UX/UI' },
  { name: 'Développement', description: 'Front, back, full-stack, DevOps', icon: Code2, count: 'Full-stack' },
  { name: 'Maintenance', description: 'Techniciens, astreintes, terrain', icon: Wrench, count: 'Terrain' },
  { name: 'Stage', description: 'Première expérience, alternance', icon: GraduationCap, count: 'Stage' },
]

const HOW_IT_WORKS = [
  {
    icon: Eye,
    step: '01',
    title: 'Pour les candidats',
    text: 'Consultez les offres, postulez en quelques minutes sans créer de compte. Votre CV reste privé. Vous suivez votre candidature avec un lien personnel et sécurisé.',
    bullets: ['Sans inscription', 'CV privé', 'Suivi par lien dédié'],
  },
  {
    icon: Send,
    step: '02',
    title: 'Pour les entreprises',
    text: 'Proposez une offre via un formulaire guidé. Notre équipe la valide, la publie, puis centralise les candidatures reçues — sans intermédiaire ni commission.',
    bullets: ['Formulaire structuré', 'Validation humaine', 'Aucune commission'],
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Pour les recruteurs internes',
    text: 'Un tableau de bord complet : validation des offres, suivi des candidatures, statuts, fichiers, notes internes et journal d’audit traçable.',
    bullets: ['Tableau de bord unifié', 'Audit append-only', 'Données chiffrées au repos'],
  },
]

const TRUST_ITEMS = [
  { icon: Lock, label: 'CV stockés en espace privé' },
  { icon: ShieldCheck, label: 'Aucun compte public requis' },
  { icon: Clock, label: 'Candidature en 3 minutes' },
  { icon: FileText, label: 'Audit trail complet' },
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
      {/* ========================================================= */}
      {/* HERO — premium, with layered gradient + grid texture      */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden border-b border-border bg-texture-subtle">
        {/* Background gradient — subtle, multi-layered */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
          <div className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-[28rem] rounded-full bg-primary/10 blur-3xl" />
          {/* Decorative grid — extremely subtle */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #1e3a8a 1px, transparent 1px), linear-gradient(to bottom, #1e3a8a 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow badge — refined, with bordered container */}
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-premium-xs backdrop-blur-sm">
              <span className="flex size-1.5 rounded-full bg-accent" />
              PLATEFORME DE RECRUTEMENT SANS COMPTES PUBLICS
            </span>

            <h1 className="mt-8 font-serif text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Recrutez sans friction.
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Candidatez sans compte.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              TalentForge met en relation entreprises et talents sans jamais exiger
              la création d’un compte public. Publiez une offre ou postulez en
              quelques minutes, en toute confidentialité.
            </p>

            {/* Search bar — premium, with shadow and refined focus */}
            <form
              action="/offres"
              method="GET"
              className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-premium-sm transition-shadow focus-within:shadow-premium"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  name="search"
                  aria-label="Rechercher une offre"
                  placeholder="Métier, mot-clé, compétence, lieu…"
                  className="h-10 w-full rounded-md bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" size="lg" className="gap-1.5">
                <Search className="size-4" />
                <span className="hidden sm:inline">Rechercher</span>
              </Button>
            </form>

            {/* Trust indicators — refined, with subtle separators */}
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              {TRUST_ITEMS.map((item, i) => (
                <div key={item.label} className="flex items-center gap-2">
                  {i > 0 && <span className="absolute h-1 w-1 -translate-x-3 rounded-full bg-border" aria-hidden />}
                  <item.icon className="size-3.5 text-primary" strokeWidth={1.75} />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/offres">
                  <Briefcase className="size-4" strokeWidth={2} />
                  Voir les offres
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/proposer-une-offre">
                  <Send className="size-4" strokeWidth={2} />
                  Proposer une offre
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* STATS BAND — minimal, elegant numbers                     */}
      {/* ========================================================= */}
      <section className="border-b border-border bg-card" aria-label="Chiffres clés">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:py-14">
          <StatCard icon={Briefcase} value={String(totalJobs)} label="Offres publiées" />
          <StatCard icon={Building2} value="4" label="Entreprises partenaires" />
          <StatCard icon={FileText} value="0" label="Candidatures traitées" />
          <StatCard icon={Users} value="100%" label="Confidentialité des données" />
        </div>
      </section>

      {/* ========================================================= */}
      {/* FEATURED JOBS                                              */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 py-16 md:py-24" aria-labelledby="featured-jobs-title">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Sélection
            </span>
            <h2 id="featured-jobs-title" className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Offres à la une
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Une sélection d’opportunités publiées par nos entreprises partenaires.
            </p>
          </div>
          <Button asChild variant="ghost" className="gap-2 text-primary hover:bg-secondary hover:text-primary">
            <Link href="/offres">
              Toutes les offres
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </Button>
        </div>

        {jobs.items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
                <Briefcase className="size-5 text-muted-foreground" strokeWidth={1.75} />
              </div>
              <p className="text-sm text-muted-foreground">
                Aucune offre publiée pour le moment. Revenez bientôt.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.items.map((job, i) => (
              <div
                key={job.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* HOW IT WORKS — premium 3-step cards with numbered badges  */}
      {/* ========================================================= */}
      <section
        className="relative overflow-hidden border-y border-border bg-secondary/30 py-16 md:py-24"
        aria-labelledby="how-title"
      >
        <div className="absolute inset-0 -z-10 bg-texture-subtle" aria-hidden />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Parcours
            </span>
            <h2 id="how-title" className="mt-3 font-serif text-3xl font-bold tracking-tight md:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Trois parcours pensés pour la simplicité, sans aucun compte à créer.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <Card
                key={item.title}
                className="hover-lift relative h-full overflow-hidden border-border/80 bg-card shadow-premium-sm hover:shadow-premium-lg hover:border-primary/30"
              >
                {/* Top accent line — subtle premium detail */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <CardContent className="flex h-full flex-col gap-4 p-7">
                  <div className="flex items-start justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                      <item.icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <span className="font-serif text-3xl font-bold text-primary/15">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                  <ul className="mt-auto space-y-1.5 border-t border-border/60 pt-4">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <CheckCircle2 className="size-3.5 text-accent" strokeWidth={2} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CATEGORIES — premium grid with Lucide icons               */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 py-16 md:py-24" aria-labelledby="categories-title">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Domaines
          </span>
          <h2 id="categories-title" className="mt-3 font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Explorer par catégorie
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Trouvez rapidement une offre dans votre domaine. Chaque catégorie regroupe des opportunités validées par notre équipe.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/offres?category=${encodeURIComponent(cat.name)}`}
              className="hover-lift group relative flex items-start gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-premium-xs hover:border-primary/30 hover:shadow-premium-lg"
            >
              {/* Left accent bar — appears on hover */}
              <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary ring-1 ring-inset ring-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <cat.icon className="size-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                    strokeWidth={2}
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                <span className="mt-3 inline-flex items-center rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA — premium gradient band                        */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        {/* Decorative overlay — subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          aria-hidden
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Decorative glow */}
        <div className="absolute -right-20 top-0 size-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -left-20 bottom-0 size-72 rounded-full bg-white/5 blur-3xl" aria-hidden />

        <div className="container relative mx-auto flex flex-col items-center gap-8 px-4 py-16 text-center md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm">
            <Sparkles className="size-3.5" strokeWidth={2} />
            COMMENCEZ AUJOURD’HUI
          </span>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Prêt à publier votre offre ou à postuler ?
          </h2>
          <p className="mx-auto max-w-2xl text-base text-white/80 md:text-lg">
            Aucune création de compte. Aucun engagement. Vous gardez le contrôle
            total de vos données à chaque étape.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 border-0 bg-white text-primary shadow-premium-lg hover:bg-white/95 hover:text-primary"
            >
              <Link href="/proposer-une-offre">
                <Send className="size-4" strokeWidth={2} />
                Proposer une offre
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white"
            >
              <Link href="/offres">
                <Briefcase className="size-4" strokeWidth={2} />
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
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/10">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-serif text-3xl font-bold leading-none tracking-tight text-foreground">{value}</p>
        <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
