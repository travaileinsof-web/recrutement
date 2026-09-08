'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Briefcase, Send, Eye, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose, SheetDescription } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/offres', label: 'Offres', icon: Briefcase },
  { href: '/proposer-une-offre', label: 'Proposer une offre', icon: Send },
  { href: '/suivi-candidature', label: 'Suivi candidature', icon: Eye },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Subtle elevation effect when scrolled
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        scrolled
          ? 'glass border-border shadow-premium-xs'
          : 'border-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:h-18">
        {/* Logo — premium monogram */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Accueil TalentForge">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-premium-sm transition-transform group-hover:scale-105">
            <span className="font-serif text-lg font-bold leading-none">T</span>
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            TalentForge
          </span>
        </Link>

        {/* Desktop nav — with animated underline */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                data-active={active}
                className={cn(
                  'nav-underline relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button asChild className="gap-2">
            <Link href="/proposer-une-offre">
              <Send className="size-4" strokeWidth={2} />
              Proposer une offre
            </Link>
          </Button>
        </div>

        {/* Mobile menu */}
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
            <SheetTitle className="font-serif text-lg">
              Navigation
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation principale
            </SheetDescription>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Navigation mobile">
              {NAV.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <item.icon className="size-4" strokeWidth={1.75} />
                      {item.label}
                    </Link>
                  </SheetClose>
                )
              })}
            </nav>
            <div className="mt-6 border-t border-border pt-6">
              <SheetClose asChild>
                <Button asChild className="w-full gap-2">
                  <Link href="/proposer-une-offre">
                    <Send className="size-4" strokeWidth={2} />
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
