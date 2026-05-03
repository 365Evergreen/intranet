import { app } from '@azure/functions'
import { getClientPrincipal } from '../shared/auth'
import { buildDashboardSummary } from '../shared/dashboardService'
import { handleError, jsonResponse } from '../shared/errorHandler'
import { buildGraphContext } from '../shared/graphClient'

app.http('dashboard', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'dashboard',
  handler: async (request, context) => {
    try {
      const requestContext = buildGraphContext(request, getClientPrincipal(request))
      return jsonResponse(await buildDashboardSummary(requestContext, context))
    } catch (error) {
      return handleError(context, error)
    }
  },
})
