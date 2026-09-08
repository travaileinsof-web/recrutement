import { SubmissionDetail } from '@/components/admin/submission-detail'
import { serverFetch } from '@/lib/server-fetch'
import { requireAdmin } from '@/lib/auth'
import type { AdminSubmission } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata() {
  return { title: 'Détail de la soumission' }
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params
  const initialData = await serverFetch<AdminSubmission>(`/api/admin/job-submissions/${id}`)
  return <SubmissionDetail id={id} initialData={initialData} />
}
