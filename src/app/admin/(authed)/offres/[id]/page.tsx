import { JobDetail } from '@/components/admin/job-detail'
import { serverFetch } from '@/lib/server-fetch'
import { requireAdmin } from '@/lib/auth'
import type { AdminJob, AdminCompany } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata() {
  return { title: 'Détail de l’offre' }
}

export default async function JobDetailPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params
  // Pre-fetch the job + companies list on the server for synchronous render.
  const [job, companies] = await Promise.all([
    serverFetch<AdminJob>(`/api/admin/jobs/${id}`),
    serverFetch<{ items: AdminCompany[]; total: number }>(`/api/admin/companies`),
  ])
  return <JobDetail id={id} initialJob={job} initialCompanies={companies?.items ?? null} />
}
