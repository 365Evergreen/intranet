import { app } from '@azure/functions'
import { getClientPrincipal } from '../shared/auth'
import { handleError, jsonResponse } from '../shared/errorHandler'
import { storageClient } from '../shared/storageClient'
import type { UserPreferences } from '../shared/contracts'

app.http('preferences-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'storage/preferences',
  handler: async (request, context) => {
    try {
      const principal = getClientPrincipal(request)
      return jsonResponse(storageClient.getPreferences(principal.userId))
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('preferences-put', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'storage/preferences',
  handler: async (request, context) => {
    try {
      const principal = getClientPrincipal(request)
      const preferences = (await request.json()) as UserPreferences
      return jsonResponse(storageClient.setPreferences(principal.userId, preferences))
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('storage-sas', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'storage/sas',
  handler: async (_, context) => {
    try {
      return jsonResponse({
        url: 'https://storage.example.invalid/blob',
        expiresInMinutes: 15,
      })
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('storage-upload', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'storage/upload',
  handler: async (request, context) => {
    try {
      const payload = (await request.json()) as { fileName?: string }
      return jsonResponse({
        fileName: payload.fileName ?? 'upload.bin',
        path: `uploads/${payload.fileName ?? 'upload.bin'}`,
      })
    } catch (error) {
      return handleError(context, error)
    }
  },
})
