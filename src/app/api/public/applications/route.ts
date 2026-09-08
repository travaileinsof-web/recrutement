import { NextRequest } from 'next/server'
import { submitApplication } from '@/server/services/applications.service'
import { handleZodError, jsonOk, jsonError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// Multipart form-data: fields + files (cv required, coverLetter optional)
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const fields: Record<string, string> = {}
    const answers: Record<string, string> = {}
    const files: { field: 'cv' | 'coverLetter'; filename: string; mimeType: string; buffer: Buffer }[] = []

    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') {
        if (key.startsWith('answer_')) {
          answers[key.slice('answer_'.length)] = value
        } else {
          fields[key] = value
        }
      } else if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        if (key === 'cv' || key === 'coverLetter') {
          files.push({
            field: key,
            filename: value.name,
            mimeType: value.type || 'application/octet-stream',
            buffer,
          })
        }
      }
    }

    // Reconstruct the expected schema input
    const input = {
      jobId: fields.jobId,
      candidateName: fields.candidateName,
      candidateEmail: fields.candidateEmail,
      candidatePhone: fields.candidatePhone || undefined,
      candidateCity: fields.candidateCity || undefined,
      coverLetter: fields.coverLetter || undefined,
      answers,
      consent: fields.consent === 'true' || fields.consent === 'on',
      idempotencyKey: fields.idempotencyKey || undefined,
      websiteCheck: fields.websiteCheck || undefined,
      captchaToken: fields.captchaToken || undefined,
    }

    const ip = clientIp(req)
    const userAgent = req.headers.get('user-agent')
    const result = await submitApplication(input, files, ip, userAgent)
    return jsonOk(result)
  } catch (e: any) {
    if (e?.message === 'HONEYPOT_TRIGGERED') {
      // Pretend success to confuse bots
      return jsonOk({ publicReference: 'APP-HIDDEN-000000', applicationId: 'rejected', trackingToken: '' })
    }
    if (e?.message === 'CAPTCHA_FAILED') {
      return jsonError('CAPTCHA_FAILED', 'Vérification anti-robot échouée', 422)
    }
    if (e?.message === 'RATE_LIMIT_EXCEEDED') {
      return jsonError('RATE_LIMIT', 'Trop de candidatures. Réessayez plus tard.', 429)
    }
    return handleZodError(e)
  }
}
