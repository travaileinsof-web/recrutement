import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TalentForge — Recrutez sans friction, candidatez sans compte',
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
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TalentForge',
    url: 'https://talentforge.gn',
    logo: 'https://talentforge.gn/logo.svg',
    sameAs: [],
  }

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">{children}</div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
