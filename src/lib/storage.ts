// Local private storage adapter for files (CV, cover letters, company documents).
// In production this would be backed by an S3-compatible bucket; here we use
// a private local directory that is NOT served statically.

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { sha256Hex } from '@/lib/tokens'

const STORAGE_DIR = process.env.STORAGE_DIR || '/home/z/my-project/storage/private'

async function ensureDir() {
  await fs.mkdir(STORAGE_DIR, { recursive: true })
}

export interface StoredFile {
  storageKey: string
  sha256: string
  sizeBytes: number
  mimeType: string
}

export async function storeFile(
  buffer: Buffer,
  mimeType: string,
  originalName: string,
): Promise<StoredFile> {
  await ensureDir()
  const id = crypto.randomBytes(16).toString('hex')
  const ext = path.extname(originalName || '').toLowerCase()
  const storageKey = `${id}${ext}`
  const fullPath = path.join(STORAGE_DIR, storageKey)
  await fs.writeFile(fullPath, buffer)
  return {
    storageKey,
    sha256: sha256Hex(buffer),
    sizeBytes: buffer.length,
    mimeType,
  }
}

export async function readFile(storageKey: string): Promise<Buffer> {
  const fullPath = path.join(STORAGE_DIR, storageKey)
  return fs.readFile(fullPath)
}

export async function deleteFile(storageKey: string): Promise<void> {
  try {
    const fullPath = path.join(STORAGE_DIR, storageKey)
    await fs.unlink(fullPath)
  } catch {
    // Ignore if missing
  }
}

// ----- File validation -----
const ALLOWED_MIME: Record<string, true> = {
  'application/pdf': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
}

const ALLOWED_EXT: Record<string, true> = {
  '.pdf': true,
  '.docx': true,
}

export const MAX_FILE_SIZE_MB = 10

export function validateFile(
  filename: string,
  mimeType: string,
  sizeBytes: number,
  maxMb = MAX_FILE_SIZE_MB,
): { ok: true } | { ok: false; error: string } {
  const ext = path.extname(filename || '').toLowerCase()
  if (!ALLOWED_EXT[ext]) {
    return { ok: false, error: `Extension non autorisée : ${ext || '(aucune)'}` }
  }
  if (!ALLOWED_MIME[mimeType]) {
    return { ok: false, error: `Type MIME non autorisé : ${mimeType}` }
  }
  if (sizeBytes > maxMb * 1024 * 1024) {
    return { ok: false, error: `Fichier trop volumineux (max ${maxMb} Mo)` }
  }
  if (sizeBytes === 0) {
    return { ok: false, error: 'Fichier vide' }
  }
  return { ok: true }
}
