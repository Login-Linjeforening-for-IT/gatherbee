import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface StatsQuery {
    path: string
    domain: string
    type: string
    from_date: string
    to_date: string
}

export default async function getPerformanceStats(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { path, domain, type, from_date, to_date } = request.query as StatsQuery

        if (!path || !domain || !type || !from_date || !to_date) {
            return reply.status(400).send({
                error: 'Missing required parameters: path, domain, type, from_date, to_date'
            })
        }

        const query = `
            SELECT 
                DATE(ap.created_at) as date,
                AVG(ap.duration) as avg_duration,
                COUNT(*) as visits
            FROM analytics_performances ap
            JOIN URI u ON ap.URI = u.id
            WHERE u.domain = $1 
                AND u.path = $2 
                AND ap.type = $3
                AND ap.created_at >= $4::date
                AND ap.created_at < ($5::date + INTERVAL '1 day')
            GROUP BY DATE(ap.created_at)
            ORDER BY date ASC
        `

        const params = [domain, path, type, from_date, to_date]
        const result = await run(query, params)

        const stats = result.rows.map(row => ({
            date: row.date,
            avg_duration: parseFloat(row.avg_duration),
            visits: parseInt(row.visits)
        }))

        return reply.send({
            path,
            domain,
            type,
            from_date,
            to_date,
            stats
        })

    } catch (error) {
        console.error('Error fetching performance stats:', error)
        return reply.status(500).send({
            error: 'Internal server error'
        })
    }
}
