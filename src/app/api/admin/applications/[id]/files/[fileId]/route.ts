import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { readFile } from '@/lib/storage'
import { jsonOk, jsonError, handleZodError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  try {
    await requireAdmin()
    const { id, fileId } = await params
    const file = await db.file.findFirst({
      where: { id: fileId, applicationId: id },
    })
    if (!file) return jsonError('NOT_FOUND', 'Fichier introuvable', 404)

    const buffer = await readFile(file.storageKey)
    const headers = new Headers({
      'Content-Type': file.mimeType,
      'Content-Length': String(file.sizeBytes),
      'Content-Disposition': `inline; filename="${encodeURIComponent(file.originalName)}"`,
      'Cache-Control': 'private, no-store',
    })
    return new Response(new Uint8Array(buffer), { headers })
  } catch (e) {
    return handleZodError(e)
  }
}
