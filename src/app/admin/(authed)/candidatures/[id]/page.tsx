import { ApplicationDetail } from '@/components/admin/application-detail'
import { serverFetch } from '@/lib/server-fetch'
import { requireAdmin } from '@/lib/auth'
import type { AdminApplication } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata() {
  return { title: 'Détail de la candidature' }
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params
  const initialData = await serverFetch<AdminApplication>(`/api/admin/applications/${id}`)
  return <ApplicationDetail id={id} initialData={initialData} />
}
