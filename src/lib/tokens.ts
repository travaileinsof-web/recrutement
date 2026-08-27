// Cryptographically-secure tokens, hashed storage, expiration, revocation.
import crypto from 'crypto'

const ALGO = 'sha256'

export function generateToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('hex')
}

export function hashToken(token: string): string {
  return crypto.createHash(ALGO).update(token).digest('hex')
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export function isExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() < Date.now()
}

// Hash a password using PBKDF2 (no external dependency needed).
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt ?? crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, s, 100_000, 64, ALGO)
    .toString('hex')
  return { hash, salt: s }
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, ALGO)
    .toString('hex')
  return constantTimeEqual(computed, hash)
}

export function sha256Hex(buffer: Buffer): string {
  return crypto.createHash(ALGO).update(buffer).digest('hex')
}

export function hashIp(ip: string): string {
  // Salted so logs cannot be reversed easily; salt is process-local.
  const salt = process.env.RATE_LIMIT_SECRET || 'rate-limit-default-salt'
  return crypto.createHash(ALGO).update(`${salt}:${ip}`).digest('hex')
}
