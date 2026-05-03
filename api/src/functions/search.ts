import { app } from '@azure/functions'
import { getClientPrincipal } from '../shared/auth'
import { handleError, jsonResponse } from '../shared/errorHandler'
import { buildGraphContext } from '../shared/graphClient'
import { searchIntranet } from '../graph/searchAdapter'

app.http('search', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'search',
  handler: async (request, context) => {
    try {
      const query = request.query.get('q') ?? ''
      const requestContext = buildGraphContext(request, getClientPrincipal(request))
      const results = await searchIntranet(requestContext, context, query)
      return jsonResponse(results.value)
    } catch (error) {
      return handleError(context, error)
    }
  },
})
