// Server-side admin layout: checks the session cookie via getCurrentAdmin
// (the same helper used by /api/admin/me), redirects to /admin/login if missing.
// Wraps every authenticated admin route with the sidebar + topbar shell.

import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { AdminShell } from '@/components/admin/admin-shell'
import type { SessionUser } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminAuthedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user: SessionUser | null = null
  try {
    user = await getCurrentAdmin()
  } catch {
    user = null
  }
  if (!user) {
    redirect('/admin/login')
  }

  return <AdminShell user={user}>{children}</AdminShell>
}
