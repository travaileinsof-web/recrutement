// Centralized error responses — never expose stack traces, SQL, paths or secrets.
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public httpStatus: number = 400,
    public detail?: unknown,
  ) {
    super(message)
  }
}

export function jsonError(
  code: string,
  message: string,
  httpStatus = 400,
  extra?: Record<string, unknown>,
) {
  return Response.json({ error: { code, message, ...extra } }, { status: httpStatus })
}

export function jsonOk(data: unknown) {
  return Response.json({ data })
}

export function handleZodError(error: unknown) {
  // Zod errors have an `issues` array
  if (error && typeof error === 'object' && 'issues' in error && Array.isArray((error as any).issues)) {
    const issues = (error as any).issues.map((i: any) => ({
      path: i.path?.join('.') ?? '',
      message: i.message ?? '',
    }))
    return jsonError('VALIDATION_ERROR', 'Données invalides', 422, { issues })
  }
  if (error instanceof ApiError) {
    return jsonError(error.code, error.message, error.httpStatus)
  }
  console.error('[api] unexpected error', error)
  return jsonError('INTERNAL_ERROR', 'Erreur interne', 500)
}

export function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError('VALIDATION_ERROR', `${field} est requis`, 422)
  }
  return value
}
