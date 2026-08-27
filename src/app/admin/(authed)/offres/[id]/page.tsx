import { JobDetail } from '@/components/admin/job-detail'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata() {
  return { title: 'Détail de l’offre' }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  return <JobDetail id={id} />
}
