import { app } from '@azure/functions'
import { searchContent } from '../shared/dataStore'
import { handleError, jsonResponse } from '../shared/errorHandler'

app.http('search', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'search',
  handler: async (request, context) => {
    try {
      const query = request.query.get('q') ?? ''
      return jsonResponse(searchContent(query))
    } catch (error) {
      return handleError(context, error)
    }
  },
})
