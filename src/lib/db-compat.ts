// Helpers to keep services compatible with both SQLite and PostgreSQL.
//
// In SQLite: JSON fields are stored as String (Prisma SQLite doesn't support Json).
// In PostgreSQL: they're native Json or String[].
//
// Use `encodeJsonField` and `encodeStringArrayField` when writing, and
// `decodeJsonField` / `decodeStringArrayField` when reading.

export function encodeJsonField(value: unknown): unknown {
  // In SQLite mode (DATABASE_URL starts with "file:"), Prisma expects a String.
  // In PostgreSQL mode, it accepts the raw value (Json).
  if (process.env.DATABASE_URL?.startsWith('file:')) {
    return JSON.stringify(value ?? {})
  }
  return value
}

export function encodeStringArrayField(value: string[] | undefined): unknown {
  if (process.env.DATABASE_URL?.startsWith('file:')) {
    return JSON.stringify(value ?? [])
  }
  return value ?? []
}

export function decodeJsonField<T>(value: unknown, fallback: T): T {
  if (typeof value === 'string') {
    try {
      return (JSON.parse(value) ?? fallback) as T
    } catch {
      return fallback
    }
  }
  return (value as T) ?? fallback
}

export function decodeStringArrayField<T = string>(value: unknown): T[] {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return Array.isArray(value) ? value : []
}

export function isPostgres(): boolean {
  return !process.env.DATABASE_URL?.startsWith('file:')
}
