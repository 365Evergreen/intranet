import { app } from '@azure/functions'
import { getClientPrincipal } from '../shared/auth'
import { getChatToken, getNavigation, getOrgNodes } from '../shared/dataStore'
import { handleError, jsonResponse } from '../shared/errorHandler'

app.http('ai-token', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'ai/token',
  handler: async (_, context) => {
    try {
      return jsonResponse(getChatToken())
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('ai-grounding', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'ai/grounding',
  handler: async (request, context) => {
    try {
      const principal = getClientPrincipal(request)
      return jsonResponse({
        sections: [
          {
            title: 'User',
            items: [principal.userDetails, ...principal.userRoles],
          },
          {
            title: 'Navigation',
            items: getNavigation().map((item) => item.label),
          },
          {
            title: 'Organisation',
            items: getOrgNodes().map((node) => node.name),
          },
        ],
      })
    } catch (error) {
      return handleError(context, error)
    }
  },
})
