// Browser-side helper (used by client components). Always relative URLs.
// NEVER import next/headers here — that would break client components.

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string; issues?: unknown }> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
      },
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: json?.error?.message ?? 'Une erreur est survenue',
        issues: json?.error?.issues,
      }
    }
    return { ok: true, data: (json?.data ?? json) as T }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erreur réseau'
    return { ok: false, status: 0, message }
  }
}
