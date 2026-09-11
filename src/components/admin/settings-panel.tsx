'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Save, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { apiFetch } from '@/lib/api-client'

interface Settings {
  appName: string
  contactEmail: string
  trackingLinkTtlHours: number
  maxFileSizeMb: number
  consentVersion: string
}

export function SettingsPanel({ initial }: { initial: Settings | null }) {
  const [form, setForm] = React.useState<Settings>(
    initial ?? {
      appName: 'TalentForge',
      contactEmail: 'contact@talentforge.gn',
      trackingLinkTtlHours: 720,
      maxFileSizeMb: 10,
      consentVersion: '1.0.0',
    },
  )
  const [saving, setSaving] = React.useState(false)
  const [flushing, setFlushing] = React.useState(false)

  const save = async () => {
    setSaving(true)
    const result = await apiFetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (result.ok) {
      toast.success('Paramètres enregistrés')
    } else {
      toast.error(result.message)
    }
    setSaving(false)
  }

  const flush = async () => {
    setFlushing(true)
    const result = await apiFetch<{ sent: number }>('/api/admin/notifications/flush', {
      method: 'POST',
    })
    if (result.ok) {
      toast.success(`${result.data.sent} notification(s) envoyée(s)`)
    } else {
      toast.error(result.message)
    }
    setFlushing(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paramètres généraux</CardTitle>
          <CardDescription>
            Ces valeurs sont partagées entre le site public et l’espace d’administration.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="appName">Nom de la plateforme</Label>
            <Input
              id="appName"
              value={form.appName}
              onChange={(e) => setForm({ ...form, appName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">E-mail de contact</Label>
            <Input
              id="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trackingLinkTtlHours">
              Durée de validité des liens de suivi (heures)
            </Label>
            <Input
              id="trackingLinkTtlHours"
              type="number"
              min={1}
              max={720}
              value={form.trackingLinkTtlHours}
              onChange={(e) => setForm({ ...form, trackingLinkTtlHours: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maxFileSizeMb">Taille max. des fichiers (Mo)</Label>
            <Input
              id="maxFileSizeMb"
              type="number"
              min={1}
              max={50}
              value={form.maxFileSizeMb}
              onChange={(e) => setForm({ ...form, maxFileSizeMb: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="consentVersion">Version du consentement</Label>
            <Input
              id="consentVersion"
              value={form.consentVersion}
              onChange={(e) => setForm({ ...form, consentVersion: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Incrémentez cette version à chaque modification substantielle de la politique de
              confidentialité. Les nouvelles candidatures enregistrent la version en vigueur.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Enregistrer
        </Button>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">File de notifications</CardTitle>
          <CardDescription>
            Les notifications sont enregistrées en base et expédiées par un worker. En environnement
            de démonstration, déclenchez manuellement l’envoi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={flush} disabled={flushing} variant="outline">
            {flushing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Déclencher l’envoi des notifications en attente
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comptes administrateurs</CardTitle>
          <CardDescription>
            La gestion fine des comptes administrateurs (création, rôles, révocation) n’est pas exposée
            dans l’interface de cette version. Elle est gérée via le script de seed ou directement en base.
            N’oubliez pas qu’aucun candidat et aucune entreprise externe ne peut créer de compte —
            c’est une contrainte produit non négociable.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
