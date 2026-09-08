// French labels + badge styles for every status used by the platform.

export const SUBMISSION_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumise',
  EMAIL_UNVERIFIED: 'Email non vérifié',
  PENDING_REVIEW: 'En attente de revue',
  NEEDS_CORRECTION: 'Correction demandée',
  APPROVED: 'Approuvée',
  REJECTED: 'Rejetée',
  CONVERTED_TO_JOB: 'Convertie en offre',
  CANCELLED: 'Annulée',
}

export const JOB_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PENDING_REVIEW: 'En attente',
  APPROVED: 'Approuvée',
  PUBLISHED: 'Publiée',
  PAUSED: 'En pause',
  CLOSED: 'Clôturée',
  REJECTED: 'Rejetée',
  ARCHIVED: 'Archivée',
}

export const APPLICATION_LABELS: Record<string, string> = {
  SUBMITTED: 'Déposée',
  RECEIVED: 'Reçue',
  UNDER_REVIEW: 'En revue',
  SHORTLISTED: 'Présélectionnée',
  INTERVIEW_SCHEDULED: 'Entretien planifié',
  INTERVIEW_COMPLETED: 'Entretien terminé',
  WAITLISTED: "Liste d’attente",
  ACCEPTED: 'Acceptée',
  REJECTED: 'Refusée',
  WITHDRAWN: 'Retirée',
}

export const JOB_STATUS_CLASSES: Record<string, string> = {
  DRAFT: 'bg-zinc-200 text-zinc-800',
  PENDING_REVIEW: 'bg-amber-100 text-amber-900',
  APPROVED: 'bg-sky-100 text-sky-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-900',
  PAUSED: 'bg-orange-100 text-orange-900',
  CLOSED: 'bg-zinc-200 text-zinc-700',
  REJECTED: 'bg-red-100 text-red-900',
  ARCHIVED: 'bg-zinc-200 text-zinc-600',
}

export const SUBMISSION_STATUS_CLASSES: Record<string, string> = {
  DRAFT: 'bg-zinc-200 text-zinc-800',
  SUBMITTED: 'bg-sky-100 text-sky-800',
  EMAIL_UNVERIFIED: 'bg-amber-100 text-amber-900',
  PENDING_REVIEW: 'bg-sky-100 text-sky-800',
  NEEDS_CORRECTION: 'bg-amber-100 text-amber-900',
  APPROVED: 'bg-emerald-100 text-emerald-900',
  REJECTED: 'bg-red-100 text-red-900',
  CONVERTED_TO_JOB: 'bg-emerald-100 text-emerald-900',
  CANCELLED: 'bg-zinc-200 text-zinc-700',
}

export const APPLICATION_STATUS_CLASSES: Record<string, string> = {
  SUBMITTED: 'bg-zinc-200 text-zinc-800',
  RECEIVED: 'bg-sky-100 text-sky-800',
  UNDER_REVIEW: 'bg-amber-100 text-amber-900',
  SHORTLISTED: 'bg-purple-100 text-purple-900',
  INTERVIEW_SCHEDULED: 'bg-orange-100 text-orange-900',
  INTERVIEW_COMPLETED: 'bg-orange-100 text-orange-900',
  WAITLISTED: 'bg-zinc-200 text-zinc-800',
  ACCEPTED: 'bg-emerald-100 text-emerald-900',
  REJECTED: 'bg-red-100 text-red-900',
  WITHDRAWN: 'bg-zinc-200 text-zinc-800',
}

export const CONTRACT_LABELS: Record<string, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  STAGE: 'Stage',
  ALTERNANCE: 'Alternance',
  FREELANCE: 'Freelance',
  INDEPENDANT: 'Indépendant',
  INTERIM: 'Intérim',
}

export const EXPERIENCE_LABELS: Record<string, string> = {
  DEBUTANT: 'Débutant·e',
  JUNIOR: 'Junior',
  CONFIRME: 'Confirmé·e',
  SENIOR: 'Senior',
  EXPERT: 'Expert·e',
  MANAGER: 'Manager',
}

export function StatusBadge({
  status,
  kind,
}: {
  status: string
  kind: 'submission' | 'job' | 'application'
}) {
  let label = status
  let cls = 'bg-zinc-200 text-zinc-800'

  if (kind === 'submission') {
    label = SUBMISSION_LABELS[status] ?? status
    cls = SUBMISSION_STATUS_CLASSES[status] ?? cls
  } else if (kind === 'job') {
    label = JOB_LABELS[status] ?? status
    cls = JOB_STATUS_CLASSES[status] ?? cls
  } else {
    label = APPLICATION_LABELS[status] ?? status
    cls = APPLICATION_STATUS_CLASSES[status] ?? cls
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  )
}
