// Settings cache + helpers. Settings are stored in DB; we cache them in-process
// for a short TTL to avoid hitting the DB on every request.

import { db } from '@/lib/db'

export interface PlatformSettings {
  appName: string
  contactEmail: string
  trackingLinkTtlHours: number
  maxFileSizeMb: number
  consentVersion: string
}

const DEFAULTS: PlatformSettings = {
  appName: 'TalentForge',
  contactEmail: 'contact@talentforge.local',
  trackingLinkTtlHours: 24 * 30, // 30 days
  maxFileSizeMb: 10,
  consentVersion: '1.0.0',
}

let cached: PlatformSettings | null = null
let cacheExpiresAt = 0
const TTL_MS = 30_000

export async function getSettings(): Promise<PlatformSettings> {
  if (cached && cacheExpiresAt > Date.now()) return cached
  try {
    const rows = await db.setting.findMany()
    const map = new Map(rows.map((r) => [r.key, r.value]))
    cached = {
      appName: map.get('appName') ?? DEFAULTS.appName,
      contactEmail: map.get('contactEmail') ?? DEFAULTS.contactEmail,
      trackingLinkTtlHours: Number(
        map.get('trackingLinkTtlHours') ?? DEFAULTS.trackingLinkTtlHours,
      ),
      maxFileSizeMb: Number(map.get('maxFileSizeMb') ?? DEFAULTS.maxFileSizeMb),
      consentVersion: map.get('consentVersion') ?? DEFAULTS.consentVersion,
    }
    cacheExpiresAt = Date.now() + TTL_MS
    return cached
  } catch {
    return DEFAULTS
  }
}

export async function saveSettings(input: Partial<PlatformSettings>): Promise<void> {
  const entries = Object.entries(input).filter(([, v]) => v !== undefined)
  for (const [key, value] of entries) {
    await db.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  }
  cached = null
  cacheExpiresAt = 0
}

export async function ensureDefaultSettings(): Promise<void> {
  const existing = await db.setting.count()
  if (existing > 0) return
  for (const [k, v] of Object.entries(DEFAULTS)) {
    await db.setting.create({ data: { key: k, value: String(v) } })
  }
}
