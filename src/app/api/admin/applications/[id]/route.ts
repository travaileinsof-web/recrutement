import { NextRequest } from 'next/server'
import { adminGetApplication, adminAddApplicationNote } from '@/server/services/applications.service'
import { requireAdmin } from '@/lib/auth'
import { jsonOk, jsonError, handleZodError } from '@/lib/errors'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const app = await adminGetApplication(id)
    if (!app) return jsonError('NOT_FOUND', 'Candidature introuvable', 404)
    return jsonOk(app)
  } catch (e) {
    return handleZodError(e)
  }
}

const NoteSchema = z.object({ note: z.string().min(1).max(5000) })

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const { note } = NoteSchema.parse(body)
    const entry = await adminAddApplicationNote(id, note, admin.id)
    return jsonOk(entry)
  } catch (e) {
    return handleZodError(e)
  }
}
