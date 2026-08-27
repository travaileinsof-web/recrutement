import { ApplicationDetail } from '@/components/admin/application-detail'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata() {
  return { title: 'Détail de la candidature' }
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params
  return <ApplicationDetail id={id} />
}
