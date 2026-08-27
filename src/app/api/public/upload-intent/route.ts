import { NextRequest } from 'next/server'
import { jsonOk, jsonError } from '@/lib/errors'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

// Pre-flight check: allowed MIME types & max size for the current session.
export async function GET() {
  const settings = await getSettings()
  return jsonOk({
    maxFileSizeMb: settings.maxFileSizeMb,
    allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions: ['.pdf', '.docx'],
  })
}

// Stub for the upload-intent protocol (currently unused because we accept
// multipart directly on /api/public/applications). Kept for parity with the
// specification's endpoint list.
export async function POST(_req: NextRequest) {
  return jsonError('NOT_IMPLEMENTED', 'Utilisez /api/public/applications', 501)
}
