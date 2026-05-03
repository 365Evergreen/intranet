import { app } from '@azure/functions'
import { handleError, jsonResponse } from '../shared/errorHandler'
import { storageClient } from '../shared/storageClient'
import type { NavigationItem } from '../shared/contracts'

app.http('navigation-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'storage/navigation',
  handler: async (_, context) => {
    try {
      return jsonResponse(storageClient.getNavigation())
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('navigation-put', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'storage/navigation',
  handler: async (request, context) => {
    try {
      const items = (await request.json()) as NavigationItem[]
      return jsonResponse(storageClient.setNavigation(items))
    } catch (error) {
      return handleError(context, error)
    }
  },
})
