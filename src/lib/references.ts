// Reference generation: APP-2026-000001, SUB-2026-000001, JOB-2026-000001, ORG-2026-000001
import { db } from '@/lib/db'

const PREFIXES = {
  application: 'APP',
  submission: 'SUB',
  job: 'JOB',
  company: 'ORG',
} as const

type RefKind = keyof typeof PREFIXES

function currentYear(): string {
  return String(new Date().getFullYear())
}

function pad(n: number, width = 6): string {
  return String(n).padStart(width, '0')
}

async function nextSequence(kind: RefKind): Promise<number> {
  const year = currentYear()
  const prefix = PREFIXES[kind]
  const pattern = `${prefix}-${year}-`

  // Look up the highest existing sequence number for this kind+year.
  // Branch per model to keep TypeScript happy with the union of model types.
  let records: { publicReference: string }[]
  if (kind === 'application') {
    records = await db.application.findMany({
      where: { publicReference: { startsWith: pattern } },
      select: { publicReference: true },
    })
  } else if (kind === 'submission') {
    records = await db.jobSubmission.findMany({
      where: { publicReference: { startsWith: pattern } },
      select: { publicReference: true },
    })
  } else if (kind === 'job') {
    records = await db.job.findMany({
      where: { publicReference: { startsWith: pattern } },
      select: { publicReference: true },
    })
  } else {
    records = await db.company.findMany({
      where: { publicReference: { startsWith: pattern } },
      select: { publicReference: true },
    })
  }

  let max = 0
  for (const r of records) {
    const seqStr = r.publicReference.slice(pattern.length)
    const seq = parseInt(seqStr, 10)
    if (!isNaN(seq) && seq > max) max = seq
  }
  return max + 1
}

export async function generateApplicationRef(): Promise<string> {
  const seq = await nextSequence('application')
  return `APP-${currentYear()}-${pad(seq)}`
}

export async function generateSubmissionRef(): Promise<string> {
  const seq = await nextSequence('submission')
  return `SUB-${currentYear()}-${pad(seq)}`
}

export async function generateJobRef(): Promise<string> {
  const seq = await nextSequence('job')
  return `JOB-${currentYear()}-${pad(seq)}`
}

export async function generateCompanyRef(): Promise<string> {
  const seq = await nextSequence('company')
  return `ORG-${currentYear()}-${pad(seq)}`
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 220)
}

export async function uniqueJobSlug(title: string): Promise<string> {
  const base = slugify(title) || 'offre'
  let slug = base
  let i = 1
  while (await db.job.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`
  }
  return slug
}
