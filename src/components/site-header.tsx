'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Briefcase, FileText, Send, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose, SheetDescription } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/offres', label: 'Offres' },
  { href: '/proposer-une-offre', label: 'Proposer une offre' },
  { href: '/suivi-candidature', label: 'Suivi candidature' },
]

const MOBILE_NAV_ICONS = {
  Offres: Briefcase,
  'Proposer une offre': Send,
  'Suivi candidature': Eye,
  Accueil: FileText,
} as Record<string, React.ComponentType<{ className?: string }>>

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  // Close drawer on route change.
  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Accueil TalentForge">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif text-lg font-bold">
            T
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            TalentForge
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/proposer-une-offre">
              <Send className="size-4" />
              Proposer une offre
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[360px]">
            <SheetTitle className="font-serif text-lg">Menu</SheetTitle>
            <SheetDescription className="sr-only">Navigation principale</SheetDescription>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Navigation mobile">
              {NAV.map((item) => {
                const Icon = MOBILE_NAV_ICONS[item.label] ?? FileText
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  </SheetClose>
                )
              })}
            </nav>
            <div className="mt-6">
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/proposer-une-offre">
                    <Send className="size-4" />
                    Proposer une offre
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
