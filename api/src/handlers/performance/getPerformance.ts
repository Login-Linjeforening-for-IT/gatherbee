import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface StatsQuery {
    domain: string
    path: string
    from_date: string
    to_date: string
    group_by?: 'day' | 'week' | 'month'
    type: string
}

export default async function getPerformance(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { domain, path, type, from_date, to_date, group_by = 'day' } = request.query as StatsQuery

        if (!domain || !path || !from_date || !to_date || !group_by) {
            return reply.status(400).send({
                error: 'Missing required parameters: domain, path, from_date, to_date, group_by'
            })
        }

        const dateGrouping = {
            day: 'DATE(ap.created_at)',
            week: 'DATE_TRUNC(\'week\', ap.created_at)',
            month: 'DATE_TRUNC(\'month\', ap.created_at)'
        }[group_by] || 'DATE(ap.created_at)'

        const query = `
            SELECT
                ${dateGrouping} as period,
                AVG(ap.duration) as avg_duration,
                COUNT(*) as visits
            FROM analytics_performances ap
            JOIN URI u ON ap.URI = u.id
            WHERE u.domain = $1 
                AND u.path = $2 
                AND ap.type = $3
                AND ap.created_at >= $4::date
                AND ap.created_at <= $5::date
            GROUP BY ${dateGrouping}
            ORDER BY period ASC
        `

        const params = [domain, path, type, from_date, to_date]
        const result = await run(query, params)

        const stats = result.rows.map(row => ({
            date: row.period,
            avg_duration: parseFloat(row.avg_duration),
            visits: parseInt(row.visits)
        }))

        return reply.send({
            domain,
            path,
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
