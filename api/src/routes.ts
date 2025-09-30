
import { FastifyInstance } from 'fastify'
import getIndex from './handlers/index/getIndex'
import getPaths from './handlers/uri/getPaths'
import postPerformance from './handlers/performance/postPerformance'
import getPerformance from './handlers/performance/getPerformance'
import postVisitor from './handlers/visitors/postVisitor'
import getVisitors from './handlers/visitors/getVisitors'
import getTopStats from './handlers/topStats/getTopStats'

export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)

    // uri paths
    fastify.get('/uri/paths', getPaths)

    // performance analytics
    fastify.post('/performance', postPerformance)
    fastify.get('/performance', getPerformance)

    // unique visitors analytics
    fastify.post('/visitors', postVisitor)
    fastify.get('/visitors', getVisitors)

    // top stats
    fastify.get('/stats/top', getTopStats)
}