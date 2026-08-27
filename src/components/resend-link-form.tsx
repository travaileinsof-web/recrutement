'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ResendLinkForm({
  defaultEmail,
  defaultRef,
}: {
  defaultEmail?: string
  defaultRef?: string
}) {
  const [email, setEmail] = React.useState(defaultEmail ?? '')
  const [ref, setRef] = React.useState(defaultRef ?? '')
  const [sending, setSending] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !ref) {
      toast.error('Renseignez votre e-mail et votre référence.')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/public/resend-application-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, publicReference: ref }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(json?.error?.message ?? 'Une erreur est survenue.')
        return
      }
      toast.success('Si une candidature existe, un e-mail vous a été envoyé.')
    } catch {
      toast.error('Erreur réseau. Réessayez.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Adresse e-mail utilisée pour candidater</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jean.dupont@email.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ref">Numéro de référence (APP-…)</Label>
        <Input
          id="ref"
          type="text"
          required
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="APP-XXXX-XXXX"
          className="font-mono"
        />
      </div>
      <Button type="submit" className="w-full gap-1.5" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Recevoir un nouveau lien
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        Pour des raisons de sécurité, nous ne confirmons pas l’existence d’une
        candidature. Si elle existe, un e-mail avec un nouveau lien sera envoyé à
        l’adresse indiquée.
      </p>
    </form>
  )
}
