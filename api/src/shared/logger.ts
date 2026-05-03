import type { InvocationContext } from '@azure/functions'

export function logInfo(
  context: InvocationContext,
  message: string,
  data?: Record<string, unknown>,
) {
  context.info(message, data ?? {})
}
