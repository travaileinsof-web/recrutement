// Service: job submissions (public submit + admin review)
import { db } from '@/lib/db'
import { generateSubmissionRef, generateCompanyRef } from '@/lib/references'
import { normalizeEmail, normalizePhone } from '@/lib/normalize'
import { JobSubmissionSchema } from '@/lib/validation'
import { audit } from '@/lib/audit'
import { enqueueNotification } from '@/lib/notifications'
import { rateLimit } from '@/lib/rate-limit'
import { encodeStringArrayField, decodeStringArrayField } from '@/lib/db-compat'
import { verifyTurnstileToken } from '@/lib/captcha'

// Works for both SQLite (string) and PostgreSQL (enum).
type SubmissionStatus = string

export async function submitJobOffer(input: unknown, ip: string, userAgent?: string | null) {
  const data = JobSubmissionSchema.parse(input)

  // Honeypot: websiteCheck must be empty (already enforced by Zod, but double-check)
  if (data.websiteCheck) throw new Error('HONEYPOT_TRIGGERED')

  // CAPTCHA verification (optional — only active if TURNSTILE_* env vars are set)
  const captcha = await verifyTurnstileToken(data.captchaToken, ip)
  if (!captcha.success) throw new Error('CAPTCHA_FAILED')

  // Rate limit: max 5 submissions per IP per hour
  const rl = await rateLimit(`submission:${ip}`, 5, 60 * 60 * 1000)
  if (!rl.ok) throw new Error('RATE_LIMIT_EXCEEDED')

  // Find or create company based on email
  const companyEmail = normalizeEmail(data.companyEmail)
  let company = await db.company.findFirst({ where: { email: companyEmail } })
  if (!company) {
    company = await db.company.create({
      data: {
        publicReference: await generateCompanyRef(),
        legalName: data.legalName,
        tradeName: data.tradeName || null,
        email: companyEmail,
        phone: normalizePhone(data.companyPhone),
        website: data.website || null,
        sector: data.sector || null,
        city: data.city || null,
        country: data.country || null,
        address: data.address || null,
      },
    })
  }

  const publicRef = await generateSubmissionRef()
  const submission = await db.jobSubmission.create({
    data: {
      publicReference: publicRef,
      companyId: company.id,
      contactName: data.contactName,
      contactEmail: normalizeEmail(data.contactEmail),
      contactPhone: normalizePhone(data.contactPhone),
      title: data.title,
      description: data.description,
      location: data.location || null,
      contractType: data.contractType || null,
      experienceLevel: data.experienceLevel || null,
      salaryText: data.salaryText || null,
      requiredSkills: encodeStringArrayField(data.requiredSkills) as any,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: 'PENDING_REVIEW',
      honeypot: data.websiteCheck || null,
      submittedAt: new Date(),
    },
  })

  await audit({
    action: 'JOB_SUBMISSION_PUBLIC',
    entityType: 'JobSubmission',
    entityId: submission.id,
    afterData: { reference: publicRef, title: data.title, companyId: company.id },
    ip,
    userAgent,
  })

  await enqueueNotification({
    recipientEmail: submission.contactEmail,
    type: 'SUBMISSION_CONFIRMATION',
    subject: 'Votre proposition d’offre a bien été reçue',
    payload: {
      reference: publicRef,
      title: data.title,
      companyName: company.legalName,
    },
  })

  // Notify admins
  await enqueueNotification({
    recipientEmail: 'admins@internal',
    type: 'NEW_SUBMISSION',
    subject: 'Nouvelle proposition d’offre à examiner',
    payload: { reference: publicRef, title: data.title },
  })

  return { publicReference: publicRef, id: submission.id }
}

export async function adminListSubmissions(filters: {
  status?: string
  search?: string
  page?: number
  pageSize?: number
}) {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20))
  const where = {
    AND: [
      filters.status ? { status: filters.status as SubmissionStatus } : {},
      filters.search
        ? {
            OR: [
              { title: { contains: filters.search } },
              { publicReference: { contains: filters.search } },
              { contactName: { contains: filters.search } },
              { contactEmail: { contains: filters.search } },
            ],
          }
        : {},
    ],
  }
  const [total, items] = await Promise.all([
    db.jobSubmission.count({ where }),
    db.jobSubmission.findMany({
      where,
      include: { company: true, files: true, reviewer: true },
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])
  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function adminGetSubmission(id: string) {
  const s = await db.jobSubmission.findUnique({
    where: { id },
    include: { company: true, files: true, reviewer: true, job: true },
  })
  if (!s) return null
  return {
    ...s,
    requiredSkills: decodeStringArrayField<string>(s.requiredSkills),
  }
}

export async function adminSetSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  adminId: string,
  correctionMessage?: string,
) {
  const before = await db.jobSubmission.findUnique({ where: { id } })
  if (!before) throw new Error('SUBMISSION_NOT_FOUND')

  const updated = await db.jobSubmission.update({
    where: { id },
    data: {
      status,
      reviewedAt: new Date(),
      reviewedById: adminId,
      ...(correctionMessage !== undefined ? { correctionMessage } : {}),
    },
  })

  await audit({
    actorAdminId: adminId,
    action: 'SUBMISSION_STATUS_CHANGE',
    entityType: 'JobSubmission',
    entityId: id,
    beforeData: { status: before.status },
    afterData: { status, correctionMessage },
  })

  // Notify the company contact about the decision
  const subject =
    status === 'APPROVED'
      ? 'Votre proposition d’offre a été approuvée'
      : status === 'REJECTED'
      ? 'Votre proposition d’offre n’a pas été retenue'
      : status === 'NEEDS_CORRECTION'
      ? 'Votre proposition d’offre nécessite des corrections'
      : 'Mise à jour de votre proposition d’offre'

  await enqueueNotification({
    recipientEmail: before.contactEmail,
    type: `SUBMISSION_${status}`,
    subject,
    payload: { reference: before.publicReference, title: before.title, correctionMessage },
  })

  return updated
}
