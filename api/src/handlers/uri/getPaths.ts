import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface StatsQuery {
    domain: string
}

export default async function getPaths(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { domain } = request.query as StatsQuery

        if (!domain) {
            return reply.status(400).send({
                error: 'Missing required parameter: domain'
            })
        }

        const query = `
            SELECT DISTINCT path
            FROM URI
            WHERE domain = $1
        `

        const params = [domain]
        const result = await run(query, params)

        const paths = result.rows.map(row => row.path)

        return reply.send({
            domain,
            paths
        })

    } catch (error) {
        console.error('Error fetching paths:', error)
        return reply.status(500).send({
            error: 'Internal server error'
        })
    }
}
