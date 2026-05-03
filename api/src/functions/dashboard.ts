import { app } from '@azure/functions'
import { getDashboard } from '../shared/dataStore'
import { handleError, jsonResponse } from '../shared/errorHandler'

app.http('dashboard', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'dashboard',
  handler: async (_, context) => {
    try {
      return jsonResponse(getDashboard())
    } catch (error) {
      return handleError(context, error)
    }
  },
})
