import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProsePage({
  title,
  description,
  children,
  backHref = '/',
  backLabel = 'Retour à l’accueil',
}: {
  title: string
  description?: string
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-1.5">
          <Link href={backHref}>
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold md:text-4xl">{title}</h1>
          {description && (
            <p className="mt-3 text-muted-foreground">{description}</p>
          )}
        </header>

        <div className="space-y-6 text-foreground/90 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:font-medium [&_a]:text-primary [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}
