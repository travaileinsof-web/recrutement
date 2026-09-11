import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || 'https://talentforge.gn'

  // Fetch published jobs
  const jobs = await db.job.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  })

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/offres/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/offres`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/suivi-candidature`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/proposer-une-offre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...jobUrls,
  ]
}
