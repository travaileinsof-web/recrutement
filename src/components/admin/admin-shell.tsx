'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Users,
  Building2,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { SessionUser } from '@/lib/types'

const NAV_ITEMS = [
  { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard, exact: true },
  { href: '/admin/soumissions', label: 'Soumissions', icon: Inbox },
  { href: '/admin/offres', label: 'Offres', icon: Briefcase },
  { href: '/admin/candidatures', label: 'Candidatures', icon: Users },
  { href: '/admin/entreprises', label: 'Entreprises', icon: Building2 },
  { href: '/admin/audit', label: 'Journal d’audit', icon: ScrollText },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

export function AdminShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')

  const SidebarNav = (
    <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Navigation administration">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
            {active && <ChevronRight className="ml-auto size-4 opacity-60" />}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-64 shrink-0 bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-serif text-base font-bold">
              T
            </span>
            <span className="font-serif text-lg font-bold text-sidebar-foreground">
              TalentForge
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto scroll-pretty">{SidebarNav}</div>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 text-xs">
            <p className="font-medium text-sidebar-foreground">{user.fullName}</p>
            <p className="text-sidebar-foreground/60">
              {user.role === 'ADMIN' ? 'Administrateur' : 'Recruteur'} · {user.email}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
          {/* MOBILE MENU */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
              <SheetTitle className="px-4 py-4 font-serif text-base text-sidebar-foreground">
                Menu administration
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigation administration
              </SheetDescription>
              <div className="border-t border-sidebar-border">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item)
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 text-sm font-medium',
                          active
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60',
                        )}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  )
                })}
              </div>
              <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-sidebar-border bg-transparent text-sidebar-foreground"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  Déconnexion
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Espace administration</p>
              <p className="text-sm font-medium text-foreground">
                Bonjour, {user.fullName.split(' ')[0]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline"
              >
                Voir le site ↗
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Déconnexion"
                className="lg:hidden"
                onClick={logout}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-muted/30 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
