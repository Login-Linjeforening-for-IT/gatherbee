import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface PerformanceBody {
    domain: string
    pathname: string
    duration: number
    type: string
}

export default async function postPerformance(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { domain, pathname, duration, type } = request.body as PerformanceBody

        // Validate required fields
        if (!pathname || duration === undefined || !type) {
            return reply.status(400).send({
                error: 'Missing required fields: pathname, duration, type'
            })
        }

        // Validate duration is a positive number
        if (typeof duration !== 'number' || duration < 0) {
            return reply.status(400).send({
                error: 'Duration must be a positive number'
            })
        }

        // First, insert or get the URI record
        const uriResult = await run(
            'INSERT INTO URI (domain, path) VALUES ($1, $2) ON CONFLICT (domain, path) DO NOTHING RETURNING id',
            [domain, pathname]
        )

        let uriId: number

        if (uriResult.rows.length > 0) {
            uriId = uriResult.rows[0].id
        } else {
            // URI already exists, fetch its ID
            const existingUri = await run(
                'SELECT id FROM URI WHERE domain = $1 AND path = $2',
                [domain, pathname]
            )

            if (existingUri.rows.length === 0) {
                return reply.status(500).send({
                    error: 'Failed to create or find URI record'
                })
            }

            uriId = existingUri.rows[0].id
        }

        // Insert the performance record
        await run(
            'INSERT INTO analytics_performances (URI, duration, type) VALUES ($1, $2, $3)',
            [uriId, Math.round(duration), type]
        )

        return reply.status(201).send({
            success: true,
            message: 'Performance data recorded successfully'
        })

    } catch (error) {
        console.error('Error recording performance data:', error)
        return reply.status(500).send({
            error: 'Internal server error'
        })
    }
}
