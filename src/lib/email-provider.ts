// E-mail provider abstraction.
//
// Default: Resend (https://resend.com) — set RESEND_API_KEY and EMAIL_FROM.
// Fallback: console.log (dev only).
//
// To swap to another provider (Postmark, SendGrid, AWS SES…), implement the
// `EmailProvider` interface and adjust the `resolveProvider()` function.

import { renderEmailTemplate } from '@/lib/email-templates'

export interface EmailPayload {
  to: string
  subject: string
  type: string
  data: Record<string, unknown>
}

export interface EmailResult {
  ok: boolean
  error?: string
}

interface EmailProvider {
  send(payload: EmailPayload): Promise<EmailResult>
}

// ---------------------------------------------------------------------------
// Resend provider
// ---------------------------------------------------------------------------

class ResendProvider implements EmailProvider {
  constructor(private apiKey: string, private from: string) {}

  async send(payload: EmailPayload): Promise<EmailResult> {
    try {
      const { html, text } = renderEmailTemplate(payload.type, payload.data)
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: payload.to,
          subject: payload.subject,
          html,
          text,
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        return { ok: false, error: `Resend API error ${res.status}: ${err}` }
      }
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Resend network error' }
    }
  }
}

// ---------------------------------------------------------------------------
// Console provider (dev fallback)
// ---------------------------------------------------------------------------

class ConsoleProvider implements EmailProvider {
  async send(payload: EmailPayload): Promise<EmailResult> {
    console.log(
      `[mail] → ${payload.to} | ${payload.subject} | type=${payload.type} | data=${JSON.stringify(payload.data)}`,
    )
    return { ok: true }
  }
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

let cachedProvider: EmailProvider | null = null

function resolveProvider(): EmailProvider {
  if (cachedProvider) return cachedProvider

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'TalentForge <noreply@talentforge.gn>'

  if (apiKey && apiKey.length > 0) {
    console.log('[email] Using Resend provider')
    cachedProvider = new ResendProvider(apiKey, from)
  } else {
    console.log('[email] No RESEND_API_KEY — falling back to console provider (dev mode)')
    cachedProvider = new ConsoleProvider()
  }
  return cachedProvider
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  try {
    return await resolveProvider().send(payload)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown email error' }
  }
}
