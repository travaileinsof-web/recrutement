// Server-side helper to fetch our own API routes and unwrap the { data } envelope.
// ONLY import this from Server Components (pages in app/**/page.tsx with no 'use client').

import { headers } from 'next/headers'

export async function serverFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || 'http'
  const url = `${proto}://${host}${path}`

  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      ...(init?.headers ?? {}),
      cookie: h.get('cookie') ?? '',
    },
  })

  if (!res.ok) {
    if (res.status === 404) return null
    return null
  }

  const json = await res.json()
  return (json?.data ?? json) as T
}
