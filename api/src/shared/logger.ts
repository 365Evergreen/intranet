import type { InvocationContext } from '@azure/functions'

export function logInfo(
  context: InvocationContext,
  message: string,
  data?: Record<string, unknown>,
) {
  context.info(message, data ?? {})
}

export function logWarning(
  context: InvocationContext,
  message: string,
  data?: Record<string, unknown>,
) {
  context.warn(message, data ?? {})
}

export function logError(
  context: InvocationContext,
  message: string,
  data?: Record<string, unknown>,
) {
  context.error(message, data ?? {})
}
