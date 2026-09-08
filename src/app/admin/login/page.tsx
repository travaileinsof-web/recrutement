'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, LogIn, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [checking, setChecking] = React.useState(true)

  // Redirect to /admin if already logged in.
  React.useEffect(() => {
    fetch('/api/admin/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json?.data?.user) {
          router.replace('/admin')
        } else {
          setChecking(false)
        }
      })
      .catch(() => setChecking(false))
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(json?.error?.message ?? 'Identifiants invalides.')
        return
      }
      toast.success(`Bienvenue, ${json.data.user.fullName.split(' ')[0]} !`)
      router.push('/admin')
      router.refresh()
    } catch {
      toast.error('Erreur réseau. Réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/40 via-background to-background px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1e3a8a 1px, transparent 1px), linear-gradient(to bottom, #1e3a8a 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Logo block — premium */}
        <div className="mb-8 text-center">
          <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Accueil TalentForge">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-premium-sm transition-transform group-hover:scale-105">
              <span className="font-serif text-lg font-bold leading-none">T</span>
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight">TalentForge</span>
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <ShieldCheck className="size-3.5 text-primary" strokeWidth={1.75} />
            Espace administration sécurisé
          </div>
        </div>

        <Card className="overflow-hidden border-border/80 shadow-premium-lg">
          {/* Top accent line */}
          <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-xl font-semibold tracking-tight">Connexion</CardTitle>
            <CardDescription>
              Accès réservé aux équipes internes TalentForge.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@talentforge.local"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Connexion…
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" strokeWidth={2} />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            <Alert className="border-primary/20 bg-secondary/40">
              <AlertDescription>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Compte de démonstration
                </p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">E-mail</span>
                    <code className="font-mono text-foreground">admin@talentforge.local</code>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Mot de passe</span>
                    <code className="font-mono text-foreground">admin12345</code>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
            Retour au site public
          </Link>
        </div>
      </div>
    </div>
  )
}
