// Zod validation schemas shared between client and server.
import { z } from 'zod'

// ----- Constants & controlled vocabularies -----
export const CONTRACT_TYPES = [
  'CDI',
  'CDD',
  'STAGE',
  'ALTERNANCE',
  'FREELANCE',
  'INDEPENDANT',
  'INTERIM',
] as const

export const EXPERIENCE_LEVELS = [
  'DEBUTANT',
  'JUNIOR',
  'CONFIRME',
  'SENIOR',
  'EXPERT',
  'MANAGER',
] as const

export const SUBMISSION_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'EMAIL_UNVERIFIED',
  'PENDING_REVIEW',
  'NEEDS_CORRECTION',
  'APPROVED',
  'REJECTED',
  'CONVERTED_TO_JOB',
  'CANCELLED',
] as const

export const JOB_STATUSES = [
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'PAUSED',
  'CLOSED',
  'REJECTED',
  'ARCHIVED',
] as const

export const APPLICATION_STATUSES = [
  'SUBMITTED',
  'RECEIVED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_COMPLETED',
  'WAITLISTED',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
] as const

// ----- Submission -----
export const JobSubmissionSchema = z.object({
  // Company info
  legalName: z.string().min(2, 'Le nom de l’entreprise est trop court').max(200),
  tradeName: z.string().max(200).optional().or(z.literal('')),
  companyEmail: z.string().email('Adresse e-mail entreprise invalvable').max(320),
  companyPhone: z.string().max(40).optional().or(z.literal('')),
  website: z.string().url('URL du site invalable').max(300).optional().or(z.literal('')),
  sector: z.string().max(120).optional().or(z.literal('')),
  city: z.string().max(120).optional().or(z.literal('')),
  country: z.string().max(120).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),

  // Contact
  contactName: z.string().min(2, 'Nom du contact requis').max(160),
  contactEmail: z.string().email('E-mail du contact invalable').max(320),
  contactPhone: z.string().max(40).optional().or(z.literal('')),

  // Job info
  title: z.string().min(3, 'Titre du poste trop court').max(200),
  description: z
    .string()
    .min(80, 'Description trop courte (min. 80 caractères)')
    .max(10_000),
  location: z.string().max(160).optional().or(z.literal('')),
  contractType: z.enum(CONTRACT_TYPES).optional().or(z.literal('')),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional().or(z.literal('')),
  salaryText: z.string().max(160).optional().or(z.literal('')),
  requiredSkills: z.array(z.string().max(80)).max(20).default([]),
  deadline: z.string().optional().or(z.literal('')),

  // Anti-robot honeypot — must be empty
  websiteCheck: z
    .string()
    .max(0, 'Champ anti-robot')
    .optional()
    .or(z.literal('')),

  // Consent
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions' }),
  }),
})

export type JobSubmissionInput = z.infer<typeof JobSubmissionSchema>

// ----- Application -----
export const ApplicationSchema = z.object({
  jobId: z.string().min(1, 'Offre manquante'),
  candidateName: z.string().min(2, 'Nom requis').max(160),
  candidateEmail: z.string().email('E-mail invalable').max(320),
  candidatePhone: z.string().max(40).optional().or(z.literal('')),
  candidateCity: z.string().max(120).optional().or(z.literal('')),
  coverLetter: z.string().max(20_000).optional().or(z.literal('')),
  answers: z.record(z.string(), z.string().max(2_000)).default({}),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Consentement obligatoire' }),
  }),
  idempotencyKey: z.string().max(120).optional().or(z.literal('')),
  websiteCheck: z.string().max(0, 'Champ anti-robot').optional().or(z.literal('')),
})
export type ApplicationInput = z.infer<typeof ApplicationSchema>

// ----- Admin auth -----
export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
})
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>

// ----- Admin job create/edit -----
export const AdminJobSchema = z.object({
  title: z.string().min(3).max(200),
  companyId: z.string().min(1),
  description: z.string().min(20).max(20_000),
  location: z.string().max(160).optional().or(z.literal('')),
  country: z.string().max(120).optional().or(z.literal('')),
  contractType: z.enum(CONTRACT_TYPES).optional().or(z.literal('')),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional().or(z.literal('')),
  salaryText: z.string().max(160).optional().or(z.literal('')),
  skills: z.array(z.string().max(80)).max(20).default([]),
  category: z.string().max(120).optional().or(z.literal('')),
  applicationDeadline: z.string().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(220).optional().or(z.literal('')),
  seoDescription: z.string().max(320).optional().or(z.literal('')),
})
export type AdminJobInput = z.infer<typeof AdminJobSchema>

// ----- Settings -----
export const SettingsSchema = z.object({
  appName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  trackingLinkTtlHours: z.coerce.number().int().min(1).max(720),
  maxFileSizeMb: z.coerce.number().int().min(1).max(50),
  consentVersion: z.string().min(1).max(40),
})
export type SettingsInput = z.infer<typeof SettingsSchema>
