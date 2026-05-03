import { app } from '@azure/functions'
import { getClientPrincipal } from '../shared/auth'
import { handleError, jsonResponse } from '../shared/errorHandler'

app.http('me', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'me',
  handler: async (request, context) => {
    try {
      return jsonResponse(getClientPrincipal(request))
    } catch (error) {
      return handleError(context, error)
    }
  },
})
