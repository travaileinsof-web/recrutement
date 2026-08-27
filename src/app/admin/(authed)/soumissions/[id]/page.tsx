import { SubmissionDetail } from '@/components/admin/submission-detail'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata() {
  return { title: 'Détail de la soumission' }
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params
  return <SubmissionDetail id={id} />
}
