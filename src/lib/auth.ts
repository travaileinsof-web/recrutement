// Internal admin auth: cookie-based session backed by AccessToken rows.
// No public accounts — only admins / recruiters managed here.

import { db } from '@/lib/db'
import { generateToken, hashToken, isExpired, verifyPassword } from '@/lib/tokens'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'tf_admin_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: 'ADMIN' | 'RECRUITER'
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<{ ok: true; token: string; user: SessionUser } | { ok: false; error: string }> {
  const admin = await db.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  })
  if (!admin || !admin.isActive || !admin.passwordHash) {
    return { ok: false, error: 'Identifiants invalides' }
  }
  // passwordHash stored as "salt:hash"
  const [salt, hash] = admin.passwordHash.split(':')
  if (!salt || !hash || !verifyPassword(password, hash, salt)) {
    return { ok: false, error: 'Identifiants invalides' }
  }

  const token = generateToken(32)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await db.accessToken.create({
    data: {
      tokenHash: hashToken(token),
      purpose: 'ADMIN_SESSION',
      adminUserId: admin.id,
      expiresAt,
    },
  })
  await db.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  })

  return {
    ok: true,
    token,
    user: {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role as 'ADMIN' | 'RECRUITER',
    },
  }
}

export async function revokeSession(token: string): Promise<void> {
  if (!token) return
  await db.accessToken
    .updateMany({
      where: { tokenHash: hashToken(token), purpose: 'ADMIN_SESSION' },
      data: { revokedAt: new Date() },
    })
    .catch(() => null)
}

export async function getCurrentAdmin(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = hashToken(token)
  const record = await db.accessToken.findUnique({
    where: { tokenHash },
    include: { adminUser: true },
  })
  if (!record || record.purpose !== 'ADMIN_SESSION') return null
  if (record.revokedAt) return null
  if (isExpired(record.expiresAt)) return null
  if (!record.adminUser || !record.adminUser.isActive) return null

  // Update last used
  await db.accessToken
    .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
    .catch(() => null)

  return {
    id: record.adminUser.id,
    email: record.adminUser.email,
    fullName: record.adminUser.fullName,
    role: record.adminUser.role as 'ADMIN' | 'RECRUITER',
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentAdmin()
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}

export async function requireAdminRole(...roles: string[]): Promise<SessionUser> {
  const user = await requireAdmin()
  if (roles.length && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN')
  }
  return user
}

export const SESSION_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_TTL_MS / 1000,
}
