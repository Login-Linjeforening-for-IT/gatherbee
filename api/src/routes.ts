
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import getIndex from './handlers/index/getIndex'
import getPaths from './handlers/performance/getPaths'
import postPerformance from './handlers/performance/postPerformance'
import getPerformanceStats from './handlers/performance/getPerformanceStats'

export default async function apiRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    // index
    fastify.get('/', getIndex)

    // performance analytics
    fastify.get('/performance/paths', getPaths)
    fastify.post('/performance', postPerformance)
    fastify.get('/performance/stats', getPerformanceStats)
}