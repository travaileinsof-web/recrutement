// Abstract storage adapter for private files (CV, cover letters, company documents).
//
// - Production: S3-compatible bucket (AWS S3, Cloudflare R2, MinIO, Backblaze B2…)
//   Set STORAGE_ENDPOINT, STORAGE_BUCKET, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY, STORAGE_REGION.
// - Dev fallback: local filesystem under STORAGE_DIR (default /home/z/my-project/storage/private)
//
// To swap to another storage backend, implement the `StorageAdapter` interface
// and adjust the `resolveAdapter()` function.

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { sha256Hex } from '@/lib/tokens'

export interface StoredFile {
  storageKey: string
  sha256: string
  sizeBytes: number
  mimeType: string
}

export interface StorageAdapter {
  put(buffer: Buffer, storageKey: string): Promise<void>
  get(storageKey: string): Promise<Buffer>
  delete(storageKey: string): Promise<void>
}

// ---------------------------------------------------------------------------
// Local filesystem adapter (dev fallback)
// ---------------------------------------------------------------------------

class LocalStorageAdapter implements StorageAdapter {
  constructor(private dir: string) {}

  private full(storageKey: string): string {
    // Prevent path traversal — only allow basename
    const safe = path.basename(storageKey)
    return path.join(this.dir, safe)
  }

  async put(buffer: Buffer, storageKey: string): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true })
    await fs.writeFile(this.full(storageKey), buffer)
  }

  async get(storageKey: string): Promise<Buffer> {
    return fs.readFile(this.full(storageKey))
  }

  async delete(storageKey: string): Promise<void> {
    try {
      await fs.unlink(this.full(storageKey))
    } catch {
      // ignore missing
    }
  }
}

// ---------------------------------------------------------------------------
// S3-compatible adapter
// ---------------------------------------------------------------------------

class S3StorageAdapter implements StorageAdapter {
  constructor(
    private endpoint: string,
    private bucket: string,
    private accessKey: string,
    private secretKey: string,
    private region: string,
  ) {}

  private async signedHeaders(
    method: string,
    storageKey: string,
    body: Buffer | null,
    contentType: string,
  ): Promise<Headers> {
    // AWS Signature V4 — minimal implementation for S3 PUT/GET.
    // For most S3-compatible stores, presigned URLs are simpler; but to avoid
    // adding the AWS SDK dependency, we use the standard SigV4 algorithm.
    const service = 's3'
    const now = new Date()
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
    const dateStamp = amzDate.slice(0, 8)

    const bodyHash = body
      ? crypto.createHash('sha256').update(body).digest('hex')
      : 'UNSIGNED-PAYLOAD'

    const canonicalUri = `/${this.bucket}/${storageKey}`
    const canonicalQueryString = ''
    const host = new URL(this.endpoint).host

    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${bodyHash}\nx-amz-date:${amzDate}\n`
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'

    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      bodyHash,
    ].join('\n')

    const scope = `${dateStamp}/${this.region}/s3/aws4_request`
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      scope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
    ].join('\n')

    const kDate = crypto.createHmac('sha256', `AWS4${this.secretKey}`).update(dateStamp).digest()
    const kRegion = crypto.createHmac('sha256', kDate).update(this.region).digest()
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest()
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex')

    const auth = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const headers = new Headers({
      Host: host,
      Authorization: auth,
      'x-amz-content-sha256': bodyHash,
      'x-amz-date': amzDate,
    })
    if (body && contentType) {
      headers.set('Content-Type', contentType)
    }
    return headers
  }

  async put(buffer: Buffer, storageKey: string): Promise<void> {
    const url = `${this.endpoint}${this.bucket}/${storageKey}`
    const headers = await this.signedHeaders('PUT', storageKey, buffer, 'application/octet-stream')
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: new Uint8Array(buffer),
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`S3 PUT failed ${res.status}: ${err}`)
    }
  }

  async get(storageKey: string): Promise<Buffer> {
    const url = `${this.endpoint}${this.bucket}/${storageKey}`
    const headers = await this.signedHeaders('GET', storageKey, null, '')
    const res = await fetch(url, { method: 'GET', headers })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`S3 GET failed ${res.status}: ${err}`)
    }
    return Buffer.from(await res.arrayBuffer())
  }

  async delete(storageKey: string): Promise<void> {
    const url = `${this.endpoint}${this.bucket}/${storageKey}`
    const headers = await this.signedHeaders('DELETE', storageKey, null, '')
    try {
      await fetch(url, { method: 'DELETE', headers })
    } catch {
      // ignore missing
    }
  }
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

let cachedAdapter: StorageAdapter | null = null

function resolveAdapter(): StorageAdapter {
  if (cachedAdapter) return cachedAdapter

  const endpoint = process.env.STORAGE_ENDPOINT
  const bucket = process.env.STORAGE_BUCKET
  const accessKey = process.env.STORAGE_ACCESS_KEY
  const secretKey = process.env.STORAGE_SECRET_KEY
  const region = process.env.STORAGE_REGION || 'auto'

  if (endpoint && bucket && accessKey && secretKey) {
    console.log(`[storage] Using S3-compatible adapter (bucket=${bucket})`)
    cachedAdapter = new S3StorageAdapter(endpoint, bucket, accessKey, secretKey, region)
  } else {
    const dir = process.env.STORAGE_DIR || '/home/z/my-project/storage/private'
    console.log(`[storage] No S3 config — falling back to local filesystem (${dir})`)
    cachedAdapter = new LocalStorageAdapter(dir)
  }
  return cachedAdapter
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function storeFile(
  buffer: Buffer,
  mimeType: string,
  originalName: string,
): Promise<StoredFile> {
  const id = crypto.randomBytes(16).toString('hex')
  const ext = path.extname(originalName || '').toLowerCase()
  const storageKey = `${id}${ext}`
  await resolveAdapter().put(buffer, storageKey)
  return {
    storageKey,
    sha256: sha256Hex(buffer),
    sizeBytes: buffer.length,
    mimeType,
  }
}

export async function readFile(storageKey: string): Promise<Buffer> {
  return resolveAdapter().get(storageKey)
}

export async function deleteFile(storageKey: string): Promise<void> {
  return resolveAdapter().delete(storageKey)
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
