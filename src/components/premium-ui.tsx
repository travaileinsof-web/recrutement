import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Surtitre Manuscrit (Caveat) - Signature "carnet de cabinet"
 */
export function HandwrittenSubtitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'font-script text-4xl tracking-wide text-accent -rotate-2 mb-3',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Double bouton à la voix de l'original
 */
export function DualActionButtons({
  primaryText = 'Voir nos offres',
  primaryHref = '/offres',
  secondaryText = 'Un besoin ? Discutons-en',
  secondaryHref = '/je-recrute',
  className,
}: {
  primaryText?: string
  primaryHref?: string
  secondaryText?: string
  secondaryHref?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start',
        className
      )}
    >
      <Button asChild size="lg" className="w-full sm:w-auto gap-2 shadow-premium-sm">
        <Link href={primaryHref}>
          {primaryText}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-primary/20 text-foreground/80 hover:bg-secondary">
        <Link href={secondaryHref}>
          {secondaryText}
        </Link>
      </Button>
    </div>
  )
}

/**
 * Chip WhatsApp
 */
export function WhatsAppChip({
  phoneNumber = '224620000000',
  message = 'Bonjour, je souhaite échanger au sujet de mon recrutement.',
  className,
}: {
  phoneNumber?: string
  message?: string
  className?: string
}) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-4 py-2 text-sm font-medium text-[#1DA851] transition-all hover:bg-[#25D366]/20 ring-1 ring-inset ring-[#25D366]/20',
        className
      )}
    >
      <MessageCircle className="size-4" fill="currentColor" />
      <span>Discuter sur WhatsApp</span>
    </a>
  )
}

/**
 * Compteur Fraunces des pages cabinet
 */
export function StatCounter({
  value,
  label,
  className,
}: {
  value: string | number
  label: string
  className?: string
}) {
  return (
    <div className={cn('text-center', className)}>
      <div className="font-serif text-4xl font-bold tracking-tight text-primary md:text-5xl">
        {value}
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
