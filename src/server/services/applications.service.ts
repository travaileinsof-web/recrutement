// Service: applications (public submit + admin review)
import { db } from '@/lib/db'
import { generateApplicationRef } from '@/lib/references'
import { normalizeEmail, normalizePhone, parseJsonObject, parseJsonArray } from '@/lib/normalize'
import { ApplicationSchema } from '@/lib/validation'
import { audit } from '@/lib/audit'
import { enqueueNotification } from '@/lib/notifications'
import { rateLimit } from '@/lib/rate-limit'
import { hashToken, generateToken } from '@/lib/tokens'
import { getSettings } from '@/lib/settings'
import { storeFile, validateFile } from '@/lib/storage'
import { ApiError } from '@/lib/errors'

export interface UploadedFile {
  field: 'cv' | 'coverLetter'
  filename: string
  mimeType: string
  buffer: Buffer
}

export async function submitApplication(
  input: unknown,
  files: UploadedFile[],
  ip: string,
  userAgent?: string | null,
) {
  const data = ApplicationSchema.parse(input)

  // Honeypot
  if (data.websiteCheck) throw new Error('HONEYPOT_TRIGGERED')

  // Rate limit: max 10 applications per IP per hour
  const rl = rateLimit(`application:${ip}`, 10, 60 * 60 * 1000)
  if (!rl.ok) throw new Error('RATE_LIMIT_EXCEEDED')

  // Verify the job exists and accepts applications
  const job = await db.job.findUnique({
    where: { id: data.jobId },
    include: { company: true },
  })
  if (!job) throw new ApiError('JOB_NOT_FOUND', 'Offre introuvable', 404)
  if (job.status !== 'PUBLISHED') {
    throw new ApiError('JOB_NOT_OPEN', 'Cette offre n’est plus ouverte aux candidatures', 422)
  }
  if (job.applicationDeadline && job.applicationDeadline < new Date()) {
    throw new ApiError('DEADLINE_PASSED', 'La date limite de candidature est dépassée', 422)
  }

  const settings = await getSettings()
  const candidateEmail = normalizeEmail(data.candidateEmail)

  // Idempotency: same email + job + (optional key) within last hour → block
  const idempotencyKey = data.idempotencyKey || `${job.id}:${candidateEmail}`
  const recentDup = await db.application.findFirst({
    where: {
      jobId: job.id,
      candidateEmail,
      idempotencyKey,
      submittedAt: { gt: new Date(Date.now() - 60 * 60 * 1000) },
    },
  })
  if (recentDup) {
    throw new ApiError(
      'DUPLICATE_APPLICATION',
      'Une candidature similaire a déjà été déposée récemment',
      409,
    )
  }

  // Validate CV file (mandatory)
  const cvFile = files.find((f) => f.field === 'cv')
  if (!cvFile) throw new ApiError('CV_REQUIRED', 'Le CV est obligatoire', 422)
  const cvCheck = validateFile(cvFile.filename, cvFile.mimeType, cvFile.buffer.length, settings.maxFileSizeMb)
  if (!cvCheck.ok) throw new ApiError('CV_INVALID', cvCheck.error, 422)

  // Cover letter optional
  const coverFile = files.find((f) => f.field === 'coverLetter')
  if (coverFile) {
    const coverCheck = validateFile(coverFile.filename, coverFile.mimeType, coverFile.buffer.length, settings.maxFileSizeMb)
    if (!coverCheck.ok) throw new ApiError('COVER_INVALID', coverCheck.error, 422)
  }

  // Create application first
  const publicRef = await generateApplicationRef()
  const application = await db.application.create({
    data: {
      publicReference: publicRef,
      jobId: job.id,
      companyId: job.companyId,
      candidateName: data.candidateName,
      candidateEmail,
      candidatePhone: normalizePhone(data.candidatePhone),
      candidateCity: data.candidateCity || null,
      coverLetter: data.coverLetter || null,
      answers: JSON.stringify(data.answers ?? {}),
      status: 'SUBMITTED',
      consentAccepted: true,
      consentVersion: settings.consentVersion,
      idempotencyKey,
    },
  })

  // Store CV
  const cvStored = await storeFile(cvFile.buffer, cvFile.mimeType, cvFile.filename)
  await db.file.create({
    data: {
      applicationId: application.id,
      kind: 'CV',
      originalName: cvFile.filename,
      storageKey: cvStored.storageKey,
      mimeType: cvStored.mimeType,
      sizeBytes: cvStored.sizeBytes,
      sha256: cvStored.sha256,
      isPrivate: true,
    },
  })

  // Store cover letter if provided
  if (coverFile) {
    const coverStored = await storeFile(coverFile.buffer, coverFile.mimeType, coverFile.filename)
    await db.file.create({
      data: {
        applicationId: application.id,
        kind: 'COVER_LETTER',
        originalName: coverFile.filename,
        storageKey: coverStored.storageKey,
        mimeType: coverStored.mimeType,
        sizeBytes: coverStored.sizeBytes,
        sha256: coverStored.sha256,
        isPrivate: true,
      },
    })
  }

  // Initial status history entry
  await db.applicationStatusHistory.create({
    data: {
      applicationId: application.id,
      fromStatus: null,
      toStatus: 'SUBMITTED',
      publicMessage: 'Candidature reçue',
      internalNote: 'Candidature déposée depuis le formulaire public',
    },
  })

  // Generate private tracking token
  const token = generateToken(32)
  const ttlMs = settings.trackingLinkTtlHours * 60 * 60 * 1000
  await db.accessToken.create({
    data: {
      tokenHash: hashToken(token),
      purpose: 'APPLICATION_TRACKING',
      applicationId: application.id,
      expiresAt: new Date(Date.now() + ttlMs),
    },
  })

  await audit({
    action: 'APPLICATION_PUBLIC_SUBMIT',
    entityType: 'Application',
    entityId: application.id,
    afterData: { reference: publicRef, jobId: job.id },
    ip,
    userAgent,
  })

  // Notify candidate
  await enqueueNotification({
    recipientEmail: candidateEmail,
    type: 'APPLICATION_CONFIRMATION',
    subject: 'Votre candidature a bien été reçue',
    payload: {
      reference: publicRef,
      jobTitle: job.title,
      companyName: job.company.legalName,
      trackingUrlPath: `/suivi-candidature/${token}`,
    },
  })

  // Notify admins
  await enqueueNotification({
    recipientEmail: 'admins@internal',
    type: 'NEW_APPLICATION',
    subject: 'Nouvelle candidature reçue',
    payload: { reference: publicRef, jobTitle: job.title },
  })

  return { publicReference: publicRef, applicationId: application.id, trackingToken: token }
}

export async function getApplicationByTrackingToken(token: string) {
  if (!token || token.length < 32) return null
  const tokenHash = hashToken(token)
  const record = await db.accessToken.findUnique({
    where: { tokenHash },
    include: {
      application: {
        include: {
          job: { include: { company: true } },
          statusHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
      },
    },
  })
  if (!record || record.purpose !== 'APPLICATION_TRACKING') return null
  if (record.revokedAt) return { revoked: true }
  if (record.expiresAt < new Date()) return { expired: true }
  if (!record.application) return null

  // Update last used
  await db.accessToken
    .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
    .catch(() => null)

  const app = record.application
  return {
    revoked: false,
    expired: false,
    application: {
      publicReference: app.publicReference,
      status: app.status,
      submittedAt: app.submittedAt,
      coverLetter: app.coverLetter,
      answers: parseJsonObject(app.answers),
      job: {
        title: app.job.title,
        publicReference: app.job.publicReference,
        company: {
          legalName: app.job.company.legalName,
          tradeName: app.job.company.tradeName,
        },
      },
      statusHistory: app.statusHistory.map((h) => ({
        toStatus: h.toStatus,
        publicMessage: h.publicMessage,
        createdAt: h.createdAt,
      })),
    },
  }
}

export async function adminListApplications(filters: {
  jobId?: string
  status?: string
  search?: string
  page?: number
  pageSize?: number
}) {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20))
  const where = {
    AND: [
      filters.jobId ? { jobId: filters.jobId } : {},
      filters.status ? { status: filters.status } : {},
      filters.search
        ? {
            OR: [
              { candidateName: { contains: filters.search } },
              { candidateEmail: { contains: filters.search } },
              { publicReference: { contains: filters.search } },
            ],
          }
        : {},
    ],
  }
  const [total, items] = await Promise.all([
    db.application.count({ where }),
    db.application.findMany({
      where,
      include: {
        job: { include: { company: true } },
        files: true,
      },
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])
  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function adminGetApplication(id: string) {
  const app = await db.application.findUnique({
    where: { id },
    include: {
      job: { include: { company: true } },
      files: true,
      statusHistory: { orderBy: { createdAt: 'desc' }, include: { changedBy: true } },
    },
  })
  if (!app) return null
  return {
    ...app,
    answers: parseJsonObject(app.answers),
    files: app.files.map((f) => ({
      id: f.id,
      kind: f.kind,
      originalName: f.originalName,
      sizeBytes: f.sizeBytes,
      mimeType: f.mimeType,
      createdAt: f.createdAt,
    })),
  }
}

export async function adminSetApplicationStatus(
  id: string,
  status: string,
  adminId: string,
  options: { publicMessage?: string; internalNote?: string } = {},
) {
  const before = await db.application.findUnique({ where: { id } })
  if (!before) throw new Error('APPLICATION_NOT_FOUND')

  const updated = await db.application.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  })

  await db.applicationStatusHistory.create({
    data: {
      applicationId: id,
      fromStatus: before.status,
      toStatus: status,
      changedById: adminId,
      publicMessage: options.publicMessage ?? null,
      internalNote: options.internalNote ?? null,
    },
  })

  await audit({
    actorAdminId: adminId,
    action: 'APPLICATION_STATUS_CHANGE',
    entityType: 'Application',
    entityId: id,
    beforeData: { status: before.status },
    afterData: { status, publicMessage: options.publicMessage, internalNote: options.internalNote },
  })

  // Notify candidate about status change
  await enqueueNotification({
    recipientEmail: before.candidateEmail,
    type: 'APPLICATION_STATUS_UPDATE',
    subject: 'Mise à jour de votre candidature',
    payload: {
      reference: before.publicReference,
      status,
      publicMessage: options.publicMessage,
    },
  })

  return updated
}

export async function adminAddApplicationNote(id: string, note: string, adminId: string) {
  const app = await db.application.findUnique({ where: { id } })
  if (!app) throw new Error('APPLICATION_NOT_FOUND')
  // Internal-only note: create a status history entry without changing status
  return db.applicationStatusHistory.create({
    data: {
      applicationId: id,
      fromStatus: app.status,
      toStatus: app.status,
      changedById: adminId,
      internalNote: note,
    },
  })
}
