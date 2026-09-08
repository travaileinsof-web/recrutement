// Shared TypeScript types for the TalentForge UI.
// These mirror the JSON shapes returned by the public and admin APIs.

export interface PublicJobCompany {
  id: string
  legalName: string
  tradeName?: string | null
  city?: string | null
  country?: string | null
  sector?: string | null
}

export interface PublicJob {
  id: string
  publicReference: string
  slug: string
  title: string
  description: string
  location: string | null
  country: string | null
  contractType: string | null
  experienceLevel: string | null
  salaryText: string | null
  skills: string[]
  category: string | null
  publishedAt: string | null
  applicationDeadline: string | null
  isFeatured: boolean
  seoTitle: string | null
  seoDescription: string | null
  company: PublicJobCompany | null
}

export interface PaginatedJobs {
  items: PublicJob[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminCompany {
  id: string
  publicReference: string
  legalName: string
  tradeName: string | null
  email: string
  phone: string | null
  website: string | null
  city: string | null
  country: string | null
  sector: string | null
  isVerified: boolean
  createdAt: string
  _count?: { jobs: number; applications: number; submissions: number }
}

export interface AdminJob {
  id: string
  publicReference: string
  slug: string
  companyId: string
  title: string
  description: string
  location: string | null
  country: string | null
  contractType: string | null
  experienceLevel: string | null
  salaryText: string | null
  skills: string
  category: string | null
  publishedAt: string | null
  applicationDeadline: string | null
  status: string
  isFeatured: boolean
  seoTitle: string | null
  seoDescription: string | null
  createdAt: string
  updatedAt: string
  company?: AdminCompany
  _count?: { applications: number }
}

export interface AdminSubmission {
  id: string
  publicReference: string
  companyId: string | null
  contactName: string
  contactEmail: string
  contactPhone: string | null
  title: string
  description: string
  location: string | null
  contractType: string | null
  experienceLevel: string | null
  salaryText: string | null
  requiredSkills: string | string[]
  deadline: string | null
  status: string
  correctionMessage: string | null
  submittedAt: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
  company?: AdminCompany | null
  reviewer?: { id: string; fullName: string; email: string } | null
  job?: { id: string; publicReference: string; title: string } | null
  files?: Array<{
    id: string
    kind: string
    originalName: string
    sizeBytes: number
    mimeType: string
  }>
}

export interface AdminApplicationFile {
  id: string
  kind: string
  originalName: string
  sizeBytes: number
  mimeType: string
  createdAt: string
}

export interface AdminApplicationStatusHistory {
  id: string
  fromStatus: string | null
  toStatus: string
  publicMessage: string | null
  internalNote: string | null
  createdAt: string
  changedBy?: { id: string; fullName: string; email: string } | null
}

export interface AdminApplication {
  id: string
  publicReference: string
  jobId: string
  companyId: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string | null
  candidateCity: string | null
  coverLetter: string | null
  answers: Record<string, string>
  status: string
  consentAccepted: boolean
  consentVersion: string
  submittedAt: string
  updatedAt: string
  job?: {
    id: string
    title: string
    publicReference: string
    company: AdminCompany
  }
  files: AdminApplicationFile[]
  statusHistory: AdminApplicationStatusHistory[]
}

export interface AuditLogEntry {
  id: string
  actorAdminId: string | null
  actor?: { id: string; fullName: string; email: string } | null
  action: string
  entityType: string
  entityId: string | null
  ipHash: string | null
  userAgent: string | null
  createdAt: string
}

export interface DashboardStats {
  publishedJobs: number
  pendingSubmissions: number
  pendingReviewJobs: number
  newApplications: number
  underReviewApps: number
  closedJobs: number
  failedNotifications: number
  totalCompanies: number
  totalApplications: number
  totalJobs: number
}

export interface DashboardActivity {
  date: string
  applications: number
  submissions: number
}

export interface DashboardData {
  stats: DashboardStats
  activity: DashboardActivity[]
  recentSubmissions: AdminSubmission[]
  recentApplications: Array<{
    id: string
    publicReference: string
    candidateName: string
    candidateEmail: string
    submittedAt: string
    status: string
    job: { id: string; title: string; company: AdminCompany }
  }>
  priorityActions?: {
    pendingSubmissions: AdminSubmission[]
    unreviewedApplications: Array<{
      id: string
      publicReference: string
      candidateName: string
      submittedAt: string
      status: string
      job: { id: string; title: string; company: AdminCompany }
    }>
  }
}

export interface PlatformSettings {
  appName: string
  contactEmail: string
  trackingLinkTtlHours: number
  maxFileSizeMb: number
  consentVersion: string
}

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: 'ADMIN' | 'RECRUITER'
}
