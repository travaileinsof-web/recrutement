import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function JobsPagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number
  totalPages: number
  buildHref: (page: number) => string
}) {
  if (totalPages <= 1) return null

  // Build a window of 5 visible pages around the current page.
  const window = 5
  const start = Math.max(1, Math.min(page - Math.floor(window / 2), totalPages - window + 1))
  const end = Math.min(totalPages, start + window - 1)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1"
    >
      <Button asChild variant="outline" size="sm" disabled={page <= 1}>
        <Link href={buildHref(Math.max(1, page - 1))} aria-label="Page précédente">
          <ChevronLeft className="size-4" />
          Précédent
        </Link>
      </Button>

      {start > 1 && (
        <>
          <PageLink n={1} href={buildHref(1)} active={page === 1} />
          {start > 2 && <span className="px-1 text-muted-foreground">…</span>}
        </>
      )}

      {pages.map((p) => (
        <PageLink key={p} n={p} href={buildHref(p)} active={p === page} />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground">…</span>}
          <PageLink n={totalPages} href={buildHref(totalPages)} active={page === totalPages} />
        </>
      )}

      <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
        <Link href={buildHref(Math.min(totalPages, page + 1))} aria-label="Page suivante">
          Suivant
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </nav>
  )
}

function PageLink({
  n,
  href,
  active,
}: {
  n: number
  href: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-label={`Page ${n}`}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background hover:bg-muted',
      )}
    >
      {n}
    </Link>
  )
}
