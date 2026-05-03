import type { HttpResponseInit, InvocationContext } from '@azure/functions'

export function jsonResponse(body: unknown, status = 200): HttpResponseInit {
  return {
    status,
    jsonBody: body,
    headers: {
      'Content-Type': 'application/json',
    },
  }
}

export function handleError(
  context: InvocationContext,
  error: unknown,
): HttpResponseInit {
  context.error('Request failed', error)

  return jsonResponse(
    {
      message: error instanceof Error ? error.message : 'Unexpected error',
    },
    500,
  )
}
