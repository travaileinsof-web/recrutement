'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [sending, setSending] = React.useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    // Simulate async submission; no backend route is wired up for the public contact form.
    await new Promise((r) => setTimeout(r, 600))
    setSending(false)
    toast.success('Merci ! Votre message a bien été pris en compte.')
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet *</Label>
          <Input id="name" name="name" required placeholder="Jean Dupont" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" name="email" type="email" required placeholder="jean.dupont@email.com" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Objet *</Label>
        <Input id="subject" name="subject" required placeholder="Question sur une offre" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Décrivez votre demande…"
        />
      </div>
      <Button type="submit" className="gap-2" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Envoi…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Envoyer
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        Réponse sous 48h ouvrées. Pour toute question urgente concernant une
        candidature, utilisez votre lien de suivi privé.
      </p>
    </form>
  )
}
