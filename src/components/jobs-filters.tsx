'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CONTRACT_LABELS, EXPERIENCE_LABELS } from '@/lib/status-labels'

const CONTRACT_OPTIONS = Object.entries(CONTRACT_LABELS)
const EXPERIENCE_OPTIONS = Object.entries(EXPERIENCE_LABELS)
const CATEGORY_OPTIONS = ['Ingénierie', 'Énergie', 'Design', 'Développement', 'Maintenance', 'Stage']

function buildHref(
  params: URLSearchParams,
  updates: Record<string, string | null>,
): string {
  const next = new URLSearchParams(params)
  for (const [key, value] of Object.entries(updates)) {
    if (!value) next.delete(key)
    else next.set(key, value)
  }
  next.delete('page')
  const qs = next.toString()
  return qs ? `/offres?${qs}` : '/offres'
}

export function JobsFilters({
  current,
}: {
  current: {
    search?: string
    location?: string
    contractType?: string
    experienceLevel?: string
    category?: string
  }
}) {
  const router = useRouter()
  const params = useSearchParams()

  const [search, setSearch] = React.useState(current.search ?? '')
  const [location, setLocation] = React.useState(current.location ?? '')

  React.useEffect(() => {
    setSearch(current.search ?? '')
    setLocation(current.location ?? '')
  }, [current.search, current.location])

  // Debounced search.
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (search === (current.search ?? '')) return
      router.push(buildHref(params, { search: search || null }))
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        router.push(buildHref(params, { search: search || null, location: location || null }))
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="search-input">Recherche</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-input"
            type="search"
            placeholder="Métier, compétence, mot-clé…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location-input">Localisation</Label>
        <Input
          id="location-input"
          type="search"
          placeholder="Ville, région…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={() =>
            router.push(buildHref(params, { location: location || null }))
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contract-select">Type de contrat</Label>
        <Select
          value={current.contractType ?? '__all__'}
          onValueChange={(v) =>
            router.push(
              buildHref(params, {
                contractType: v === '__all__' ? null : v,
              }),
            )
          }
        >
          <SelectTrigger id="contract-select" className="w-full">
            <SelectValue placeholder="Tous les contrats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tous les contrats</SelectItem>
            {CONTRACT_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="exp-select">Niveau d’expérience</Label>
        <Select
          value={current.experienceLevel ?? '__all__'}
          onValueChange={(v) =>
            router.push(
              buildHref(params, {
                experienceLevel: v === '__all__' ? null : v,
              }),
            )
          }
        >
          <SelectTrigger id="exp-select" className="w-full">
            <SelectValue placeholder="Tous les niveaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tous les niveaux</SelectItem>
            {EXPERIENCE_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-select">Catégorie</Label>
        <Select
          value={current.category ?? '__all__'}
          onValueChange={(v) =>
            router.push(
              buildHref(params, {
                category: v === '__all__' ? null : v,
              }),
            )
          }
        >
          <SelectTrigger id="cat-select" className="w-full">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les catégories</SelectItem>
            {CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" variant="default" className="w-full">
        Appliquer les filtres
      </Button>

      {(current.search || current.location || current.contractType || current.experienceLevel || current.category) && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => router.push('/offres')}
        >
          Réinitialiser
        </Button>
      )}
    </form>
  )
}
