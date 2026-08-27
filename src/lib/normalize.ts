// Normalization helpers for emails, phones, etc.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.trim())
}

export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  const trimmed = phone.trim()
  if (!trimmed) return null
  // Strip everything except digits and leading +.
  const plus = trimmed.startsWith('+') ? '+' : ''
  const digits = trimmed.replace(/[^\d]/g, '')
  return `${plus}${digits}`
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  if (local.length <= 2) return `${local[0] ?? ''}***@${domain}`
  return `${local.slice(0, 2)}***@${domain}`
}

// JSON helpers for SQLite (which stores JSON as text).
export function parseJsonArray<T = unknown>(value: string | null | undefined): T[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function parseJsonObject<T = Record<string, unknown>>(
  value: string | null | undefined,
): T {
  if (!value) return {} as T
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as T)
      : ({} as T)
  } catch {
    return {} as T
  }
}

export function stringifyJson(value: unknown): string {
  return JSON.stringify(value ?? {})
}
