// Cloudflare Turnstile CAPTCHA integration (optional).
//
// - Site key (TURNSTILE_SITE_KEY) is exposed to the browser and embedded in forms.
// - Secret key (TURNSTILE_SECRET_KEY) is used server-side to verify the token.
// - If env vars are unset, CAPTCHA is disabled (honeypot still active).

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export function isTurnstileEnabled(): boolean {
  return !!(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY)
}

export function getTurnstileSiteKey(): string | null {
  return process.env.TURNSTILE_SITE_KEY || null
}

export interface TurnstileVerifyResult {
  success: boolean
  error?: string
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<TurnstileVerifyResult> {
  if (!isTurnstileEnabled()) {
    // Disabled — always pass.
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'CAPTCHA manquant' }
  }

  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    })
    if (remoteIp) body.set('remoteip', remoteIp)

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const json = (await res.json()) as { success: boolean; 'error-codes'?: string[] }

    if (!json.success) {
      return {
        success: false,
        error: json['error-codes']?.[0] ?? 'CAPTCHA invalide',
      }
    }
    return { success: true }
  } catch (e) {
    // On network error, fail open (don't block legitimate users).
    console.warn('[turnstile] verify failed, failing open:', e)
    return { success: true }
  }
}
