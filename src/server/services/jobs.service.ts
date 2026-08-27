// Service: jobs (public + admin)
import { db } from '@/lib/db'
import { generateJobRef, uniqueJobSlug, generateCompanyRef } from '@/lib/references'
import { AdminJobSchema } from '@/lib/validation'
import { audit } from '@/lib/audit'
import { encodeStringArrayField, decodeStringArrayField } from '@/lib/db-compat'

// Status types — works for both SQLite (string) and PostgreSQL (enum).
type JobStatus = string

export interface PublicJobFilters {
  search?: string
  location?: string
  contractType?: string
  experienceLevel?: string
  category?: string
  page?: number
  pageSize?: number
}

export async function findPublicJobs(filters: PublicJobFilters) {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? 12))

  const where = {
    status: 'PUBLISHED' as JobStatus,
    AND: [
      filters.search
        ? {
            OR: [
              { title: { contains: filters.search } },
              { description: { contains: filters.search } },
              { location: { contains: filters.search } },
            ],
          }
        : {},
      filters.location ? { location: { contains: filters.location } } : {},
      filters.contractType ? { contractType: filters.contractType } : {},
      filters.experienceLevel ? { experienceLevel: filters.experienceLevel } : {},
      filters.category ? { category: filters.category } : {},
    ],
  }

  const [total, items] = await Promise.all([
    db.job.count({ where }),
    db.job.findMany({
      where,
      include: { company: true },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return {
    items: items.map(mapPublicJob),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function findPublicJobBySlug(slug: string) {
  const job = await db.job.findUnique({
    where: { slug },
    include: { company: true },
  })
  if (!job || job.status !== 'PUBLISHED') return null
  return mapPublicJob(job)
}

export function mapPublicJob(job: any) {
  return {
    id: job.id,
    publicReference: job.publicReference,
    slug: job.slug,
    title: job.title,
    description: job.description,
    location: job.location ?? null,
    country: job.country ?? null,
    contractType: job.contractType ?? null,
    experienceLevel: job.experienceLevel ?? null,
    salaryText: job.salaryText ?? null,
    // skills is String[] in PostgreSQL, JSON-String in SQLite — handle both.
    skills: decodeStringArrayField<string>(job.skills),
    category: job.category ?? null,
    publishedAt: job.publishedAt ?? null,
    applicationDeadline: job.applicationDeadline ?? null,
    isFeatured: !!job.isFeatured,
    seoTitle: job.seoTitle ?? null,
    seoDescription: job.seoDescription ?? null,
    company: job.company
      ? {
          id: job.company.id,
          legalName: job.company.legalName,
          tradeName: job.company.tradeName,
          city: job.company.city,
          country: job.company.country,
          sector: job.company.sector,
        }
      : null,
  }
}

export async function createJobFromSubmission(submissionId: string, adminId: string) {
  const submission = await db.jobSubmission.findUnique({
    where: { id: submissionId },
    include: { company: true },
  })
  if (!submission) throw new Error('Submission not found')

  // Find or create company
  let company = submission.company
  if (!company) {
    company = await db.company.create({
      data: {
        publicReference: await generateCompanyRef(),
        legalName: submission.contactName,
        email: submission.contactEmail,
        phone: submission.contactPhone,
      },
    })
  }

  const slug = await uniqueJobSlug(submission.title)
  const job = await db.job.create({
    data: {
      publicReference: await generateJobRef(),
      slug,
      companyId: company.id,
      sourceSubmissionId: submission.id,
      title: submission.title,
      description: submission.description,
      location: submission.location,
      contractType: submission.contractType,
      experienceLevel: submission.experienceLevel,
      salaryText: submission.salaryText,
      skills: encodeStringArrayField(decodeStringArrayField(submission.requiredSkills)) as any,
      applicationDeadline: submission.deadline,
      status: 'APPROVED',
      createdById: adminId,
      updatedById: adminId,
    },
  })

  await db.jobSubmission.update({
    where: { id: submission.id },
    data: { status: 'CONVERTED_TO_JOB', jobId: job.id, reviewedAt: new Date(), reviewedById: adminId },
  })

  await audit({
    actorAdminId: adminId,
    action: 'JOB_CREATE_FROM_SUBMISSION',
    entityType: 'Job',
    entityId: job.id,
    afterData: { jobId: job.id, submissionId },
  })

  return job
}

export async function adminCreateJob(input: unknown, adminId: string) {
  const data = AdminJobSchema.parse(input)
  const job = await db.job.create({
    data: {
      publicReference: await generateJobRef(),
      slug: await uniqueJobSlug(data.title),
      companyId: data.companyId,
      title: data.title,
      description: data.description,
      location: data.location || null,
      country: data.country || null,
      contractType: data.contractType || null,
      experienceLevel: data.experienceLevel || null,
      salaryText: data.salaryText || null,
      skills: encodeStringArrayField(data.skills ?? []) as any,
      category: data.category || null,
      applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
      isFeatured: data.isFeatured,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      status: 'DRAFT',
      createdById: adminId,
      updatedById: adminId,
    },
  })
  await audit({
    actorAdminId: adminId,
    action: 'JOB_CREATE',
    entityType: 'Job',
    entityId: job.id,
    afterData: { title: job.title },
  })
  return job
}

export async function adminUpdateJob(jobId: string, input: unknown, adminId: string) {
  const data = AdminJobSchema.partial().parse(input)
  const before = await db.job.findUnique({ where: { id: jobId } })
  if (!before) throw new Error('JOB_NOT_FOUND')
  const updated = await db.job.update({
    where: { id: jobId },
    data: {
      ...(data.title !== undefined ? { title: data.title, slug: await uniqueJobSlug(data.title) } : {}),
      ...(data.companyId ? { companyId: data.companyId } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.location !== undefined ? { location: data.location || null } : {}),
      ...(data.country !== undefined ? { country: data.country || null } : {}),
      ...(data.contractType !== undefined ? { contractType: data.contractType || null } : {}),
      ...(data.experienceLevel !== undefined ? { experienceLevel: data.experienceLevel || null } : {}),
      ...(data.salaryText !== undefined ? { salaryText: data.salaryText || null } : {}),
      ...(data.skills !== undefined ? { skills: encodeStringArrayField(data.skills) as any } : {}),
      ...(data.category !== undefined ? { category: data.category || null } : {}),
      ...(data.applicationDeadline !== undefined
        ? { applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null }
        : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle || null } : {}),
      ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription || null } : {}),
      updatedById: adminId,
    },
  })
  await audit({
    actorAdminId: adminId,
    action: 'JOB_UPDATE',
    entityType: 'Job',
    entityId: jobId,
    beforeData: before as Record<string, unknown>,
    afterData: updated as Record<string, unknown>,
  })
  return updated
}

export async function adminSetJobStatus(jobId: string, status: JobStatus, adminId: string) {
  const before = await db.job.findUnique({ where: { id: jobId } })
  if (!before) throw new Error('JOB_NOT_FOUND')
  const patch: { status: JobStatus; updatedById: string; publishedAt?: Date } = {
    status,
    updatedById: adminId,
  }
  if (status === 'PUBLISHED' && !before.publishedAt) {
    patch.publishedAt = new Date()
  }
  const updated = await db.job.update({ where: { id: jobId }, data: patch })
  await audit({
    actorAdminId: adminId,
    action: 'JOB_STATUS_CHANGE',
    entityType: 'Job',
    entityId: jobId,
    beforeData: { status: before.status },
    afterData: { status },
  })
  return updated
}

export async function adminListJobs(filters: {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20))
  const where = {
    AND: [
      filters.search
        ? {
            OR: [
              { title: { contains: filters.search } },
              { publicReference: { contains: filters.search } },
            ],
          }
        : {},
      filters.status ? { status: filters.status as JobStatus } : {},
    ],
  }
  const [total, items] = await Promise.all([
    db.job.count({ where }),
    db.job.findMany({
      where,
      include: { company: true, _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])
  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}
