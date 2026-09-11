import type { Metadata } from 'next'
import { Nunito_Sans, Fraunces, Caveat } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'

const nunito = Nunito_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const fraunces = Fraunces({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
})

const caveat = Caveat({
  variable: '--font-script',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TalentForge — Recrutement à Conakry sans friction',
    template: '%s · TalentForge',
  },
  description:
    'Plateforme de recrutement : consultez les offres, proposez une offre en tant qu’entreprise, postulez en quelques minutes sans créer de compte.',
  keywords: [
    'recrutement',
    'offres d’emploi',
    'candidature',
    'sans compte',
    'TalentForge',
    'Conakry',
    'Guinée'
  ],
  authors: [{ name: 'TalentForge' }],
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'TalentForge',
    description: 'Recrutez sans friction. Candidatez sans compte.',
    siteName: 'TalentForge',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#FAF8F5"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#1E1C22"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TalentForge',
              url: 'https://talentforge.gn',
              logo: 'https://talentforge.gn/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'contact@talentforge.gn',
                contactType: 'customer service',
                areaServed: 'GN',
                availableLanguage: 'French',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${fraunces.variable} ${caveat.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">{children}</div>
          <Toaster richColors position="top-right" />
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  )
}
