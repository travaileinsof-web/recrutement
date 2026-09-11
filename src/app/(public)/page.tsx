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
  ShieldCheck,
  Cpu,
  Zap,
  Palette,
  Code2,
  Wrench,
  GraduationCap,
  CheckCircle2,
  Lock,
  Clock,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { JobCard } from '@/components/job-card'
import { HandwrittenSubtitle, DualActionButtons, WhatsAppChip } from '@/components/premium-ui'
import { serverFetch } from '@/lib/server-fetch'
import type { PaginatedJobs } from '@/lib/types'

type Category = {
  name: string
  description: string
  icon: LucideIcon
  count: string
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
    image: '/images/people/candidate-man.png',
    imageAlt: 'Candidat noir africain souriant en chemise blanche',
  },
  {
    icon: Send,
    step: '02',
    title: 'Pour les entreprises',
    text: 'Proposez une offre via un formulaire guidé. Notre équipe la valide, la publie, puis centralise les candidatures reçues — sans intermédiaire ni commission.',
    bullets: ['Formulaire structuré', 'Validation humaine', 'Aucune commission'],
    image: '/images/people/recruiter-woman.png',
    imageAlt: 'Recruteuse noire africaine confiante en costume',
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Pour les recruteurs internes',
    text: 'Un tableau de bord complet : validation des offres, suivi des candidatures, statuts, fichiers, notes internes et journal d’audit traçable.',
    bullets: ['Tableau de bord unifié', 'Audit append-only', 'Données chiffrées au repos'],
    image: '/images/people/recruiter-man.png',
    imageAlt: 'Recruteur noir africain souriant en costume gris',
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
      {/* HERO — aurora gradient + noise + animated orbs            */}
      {/* ========================================================= */}
      <section className="noise-overlay relative overflow-hidden border-b border-border" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 40%, #dbeafe 100%)' }}>
        {/* Animated aurora orbs — drifting glow */}
        <div className="absolute inset-0" aria-hidden style={{ zIndex: 0 }}>
          <div
            className="aurora-orb size-[32rem] bg-blue-400/50"
            style={{ top: '-8%', right: '-2%', animationDelay: '0s' }}
          />
          <div
            className="aurora-orb size-[28rem] bg-blue-600/40"
            style={{ bottom: '-8%', left: '-3%', animationDelay: '7s' }}
          />
          <div
            className="aurora-orb size-[24rem] bg-indigo-400/35"
            style={{ top: '25%', left: '45%', animationDelay: '14s' }}
          />
        </div>

        {/* Decorative grid — extremely subtle */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.02]"
          aria-hidden
          style={{
            backgroundImage:
              'linear-gradient(to right, #1e3a8a 1px, transparent 1px), linear-gradient(to bottom, #1e3a8a 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32" style={{ zIndex: 1 }}>
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            {/* LEFT — text content */}
            <div className="text-center lg:text-left">
              {/* Eyebrow — refined pill with gradient dot */}
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-muted-foreground shadow-premium-xs backdrop-blur-md">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                </span>
                PLATEFORME DE RECRUTEMENT SANS COMPTES PUBLICS
              </span>

              <div className="mb-6">
                <HandwrittenSubtitle>Le recrutement, simplement.</HandwrittenSubtitle>
              </div>
              <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                <span className="block">Recrutez sans friction.</span>
                <span className="mt-1 block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Candidatez sans compte.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0">
                TalentForge met en relation entreprises et talents sans jamais exiger
                la création d'un compte public. Publiez une offre ou postulez en
                quelques minutes, en toute confidentialité.
              </p>

              <div className="mt-8 mb-4">
                <DualActionButtons 
                  primaryText="Voir les offres"
                  primaryHref="/offres"
                  secondaryText="Un besoin ? Discutons-en"
                  secondaryHref="/je-recrute"
                  className="lg:justify-start"
                />
              </div>

              {/* Search bar — ultra-premium with gradient focus ring */}
              <form
                action="/offres"
                method="GET"
                className="group mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-premium transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-premium-lg lg:mx-0"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    type="search"
                    name="search"
                    aria-label="Rechercher une offre"
                    placeholder="Métier, mot-clé, compétence, lieu…"
                    className="h-10 w-full rounded-md bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" size="lg" className="gap-1.5 shadow-premium-sm">
                  <Search className="size-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Rechercher</span>
                </Button>
              </form>

              {/* Trust indicators — refined, with accent dots */}
              <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs text-muted-foreground lg:mx-0 lg:justify-start">
                {TRUST_ITEMS.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {i > 0 && <span className="h-3 w-px bg-border" aria-hidden />}
                    <item.icon className="size-3.5 text-primary" strokeWidth={1.75} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons — premium with depth */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button asChild size="lg" className="gap-2 shadow-premium-sm hover:shadow-premium-lg">
                  <Link href="/offres">
                    <Briefcase className="size-4" strokeWidth={2} />
                    Voir les offres
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-secondary/50">
                  <Link href="/proposer-une-offre">
                    <Send className="size-4" strokeWidth={2} />
                    Proposer une offre
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT — premium image with floating badges */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Decorative glow behind image */}
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl" aria-hidden />

              {/* Image container with gradient border */}
              <div className="relative overflow-hidden rounded-2xl border border-white/40 shadow-premium-xl">
                <img
                  src="/images/people/candidate-woman.png"
                  alt="Candidate professionnelle noire africaine souriante en blazer bleu marine"
                  className="aspect-[3/4] w-full object-cover"
                  loading="eager"
                />
                {/* Subtle gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" aria-hidden />
              </div>

              {/* Floating stat badge — top right */}
              <div className="absolute -right-3 top-8 flex items-center gap-2.5 rounded-xl border border-border bg-card/95 p-3 shadow-premium-lg backdrop-blur-md sm:-right-6">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
                  <ShieldCheck className="size-4" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">CV 100% privé</p>
                  <p className="text-[0.7rem] text-muted-foreground">Espace sécurisé</p>
                </div>
              </div>

              {/* Floating stat badge — bottom left */}
              <div className="absolute -left-3 bottom-12 flex items-center gap-2.5 rounded-xl border border-border bg-card/95 p-3 shadow-premium-lg backdrop-blur-md sm:-left-6">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                  <Clock className="size-4" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">3 minutes</p>
                  <p className="text-[0.7rem] text-muted-foreground">Pour postuler</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade — smooth transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" aria-hidden />
      </section>

      {/* ========================================================= */}
      {/* STATS BAND — premium with gradient accent bar              */}
      {/* ========================================================= */}
      <section className="relative border-b border-border bg-card" aria-label="Chiffres clés">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
            <StatCard icon={Briefcase} value={String(totalJobs)} label="Offres publiées" />
            <StatCard icon={Building2} value="4" label="Entreprises partenaires" />
            <StatCard icon={FileText} value="0" label="Candidatures traitées" />
            <StatCard icon={Users} value="100%" label="Confidentialité des données" />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FEATURED JOBS                                              */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 py-20 md:py-28" aria-labelledby="featured-jobs-title">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Sélection
              </span>
            </div>
            <h2 id="featured-jobs-title" className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
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
              <div className="flex size-12 items-center justify-center rounded-full bg-secondary ring-1 ring-inset ring-primary/10">
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
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* HOW IT WORKS — premium 3-step with numbered cards         */}
      {/* ========================================================= */}
      <section
        className="noise-overlay relative overflow-hidden border-y border-border bg-secondary/30 py-20 md:py-28"
        aria-labelledby="how-title"
      >
        {/* Background depth */}
        <div className="absolute inset-0 -z-10 bg-texture-subtle" aria-hidden />

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Parcours
              </span>
              <span className="h-px w-8 bg-accent" />
            </div>
            <h2 id="how-title" className="mt-4 font-serif text-3xl font-bold tracking-tight md:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Trois parcours pensés pour la simplicité, sans aucun compte à créer.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.title} className="group relative">
                {/* Connector line between cards */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden h-px w-6 bg-gradient-to-r from-border to-transparent md:block" />
                )}
                <Card className="hover-lift relative h-full overflow-hidden border-border/80 bg-card shadow-premium-sm hover:border-primary/30 hover:shadow-premium-lg">
                  {/* Top accent line with shimmer */}
                  <div className="shimmer-line h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

                  <CardContent className="flex h-full flex-col gap-4 p-7">
                    {/* Header with icon + step number */}
                    <div className="flex items-start justify-between">
                      <div className="relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 text-primary ring-1 ring-inset ring-primary/15 transition-all group-hover:from-primary/15 group-hover:to-accent/10">
                        <item.icon className="size-5" strokeWidth={1.75} />
                      </div>
                      <span className="font-serif text-4xl font-bold leading-none text-primary/10 transition-colors group-hover:text-primary/20">
                        {item.step}
                      </span>
                    </div>

                    {/* Portrait image — circular, premium with ring */}
                    <div className="relative mx-auto my-2 size-20">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-md" aria-hidden />
                      <div className="relative size-full overflow-hidden rounded-full ring-2 ring-white shadow-premium">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                    <ul className="mt-auto space-y-2 border-t border-border/60 pt-4">
                      {item.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                          <span className="flex size-4 items-center justify-center rounded-full bg-accent/10">
                            <CheckCircle2 className="size-3 text-accent" strokeWidth={2.5} />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CATEGORIES — premium cards with depth + icons             */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 py-20 md:py-28" aria-labelledby="categories-title">
        <div className="mb-12 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Domaines
            </span>
          </div>
          <h2 id="categories-title" className="mt-4 font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Explorer par catégorie
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Trouvez rapidement une offre dans votre domaine. Chaque catégorie regroupe des opportunités validées par notre équipe.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Link
                href={`/offres?category=${encodeURIComponent(cat.name)}`}
                className="hover-lift group relative flex items-start gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-premium-xs hover:border-primary/30 hover:shadow-premium-lg"
              >
                {/* Left accent bar — appears on hover */}
                <div className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-gradient-to-b from-primary to-accent transition-transform duration-300 group-hover:scale-y-100" />

                {/* Icon container — gradient + glow on hover */}
                <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 text-primary ring-1 ring-inset ring-primary/10 transition-all duration-300 group-hover:from-primary group-hover:to-accent group-hover:text-white group-hover:shadow-premium">
                  <cat.icon className="size-5" strokeWidth={1.75} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {cat.name}
                    </h3>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                      strokeWidth={2}
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                  <span className="mt-3 inline-flex items-center rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                    {cat.count}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA — premium gradient band with depth              */}
      {/* ========================================================= */}
      <section className="noise-overlay relative overflow-hidden bg-brand-gradient text-white">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          aria-hidden
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Aurora orbs */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div
            className="aurora-orb size-96 bg-white/15"
            style={{ top: '-20%', right: '-10%' }}
          />
          <div
            className="aurora-orb size-80 bg-blue-300/20"
            style={{ bottom: '-15%', left: '-5%', animationDelay: '10s' }}
          />
        </div>

        <div className="container relative mx-auto flex flex-col items-center gap-8 px-4 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-[0.18em] backdrop-blur-md">
            <span className="flex size-1.5 rounded-full bg-white" />
            COMMENCEZ AUJOURD’HUI
          </span>
          <h2 className="mx-auto max-w-3xl font-serif text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.5rem]">
            Prêt à publier votre offre
            <br />
            ou à postuler ?
          </h2>
          <p className="mx-auto max-w-xl text-base text-white/80 md:text-lg">
            Aucune création de compte. Aucun engagement. Vous gardez le contrôle
            total de vos données à chaque étape.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
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
    <div className="group flex flex-col items-start gap-3 px-4 py-8 transition-colors hover:bg-secondary/30 md:flex-row md:items-center md:gap-5 md:px-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 text-primary ring-1 ring-inset ring-primary/10 transition-transform group-hover:scale-105">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-serif text-3xl font-bold leading-none tracking-tight text-foreground">{value}</p>
        <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
