import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface UniqueVisitorBody {
    domain: string
    pathname?: string | null
}

export default async function postVisitor(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { domain, pathname } = request.body as UniqueVisitorBody

        if (!domain) {
            return reply.status(400).send({
                error: 'Missing required field: domain'
            })
        }

        const path = pathname || null

        const uriResult = await run(
            'INSERT INTO URI (domain, path) VALUES ($1, $2) ON CONFLICT (domain, path) DO NOTHING RETURNING id',
            [domain, path]
        )

        let uriId: number

        if (uriResult.rows.length > 0) {
            uriId = uriResult.rows[0].id
        } else {
            const existingUri = await run(
                'SELECT id FROM URI WHERE domain = $1 AND path = $2',
                [domain, path]
            )

            if (existingUri.rows.length === 0) {
                return reply.status(500).send({
                    error: 'Failed to create or find URI record'
                })
            }

            uriId = existingUri.rows[0].id
        }

        await run(
            'INSERT INTO analytics_unique_visitors (URI) VALUES ($1)',
            [uriId]
        )

        return reply.status(201).send({
            success: true,
            message: 'Unique visitor recorded successfully',
            data: {
                domain,
                path,
                recorded_at: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error('Error recording unique visitor:', error)
        return reply.status(500).send({
            error: 'Internal server error'
        })
    }
}
