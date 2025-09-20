
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import getIndex from './handlers/index/getIndex'

export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // index
    fastify.get("/", getIndex)
}
