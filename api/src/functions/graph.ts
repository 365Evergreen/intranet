import { app } from '@azure/functions'
import { getClientPrincipal } from '../shared/auth'
import {
  getFiles,
  getNews,
  getOrgNodes,
  getTasks,
  getUserProfile,
} from '../shared/dataStore'
import { handleError, jsonResponse } from '../shared/errorHandler'
import { buildGraphContext } from '../shared/graphClient'
import { logInfo } from '../shared/logger'

app.http('graph-news', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'graph/news',
  handler: async (request, context) => {
    try {
      logInfo(context, 'Serving news feed', buildGraphContext(getClientPrincipal(request)))
      return jsonResponse(getNews())
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('graph-files-recent', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'graph/files/recent',
  handler: async (_, context) => {
    try {
      return jsonResponse(getFiles())
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('graph-people-profile', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'graph/people/profile',
  handler: async (_, context) => {
    try {
      return jsonResponse(getUserProfile())
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('graph-people-org', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'graph/people/org',
  handler: async (_, context) => {
    try {
      return jsonResponse(getOrgNodes())
    } catch (error) {
      return handleError(context, error)
    }
  },
})

app.http('graph-tasks', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'graph/tasks',
  handler: async (_, context) => {
    try {
      return jsonResponse(getTasks())
    } catch (error) {
      return handleError(context, error)
    }
  },
})
