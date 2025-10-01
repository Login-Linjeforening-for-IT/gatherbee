import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface StatsQuery {
    domain: string
    path: string
    from_date: string
    to_date: string
    group_by?: 'day' | 'week' | 'month'
}

export default async function getPerformance(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { domain, path, from_date, to_date, group_by = 'day' } = request.query as StatsQuery

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
                AVG(CASE WHEN ap.type = 'navigation' THEN ap.duration END) as navigation_avg,
                AVG(CASE WHEN ap.type = 'load' THEN ap.duration END) as load_avg
            FROM analytics_performances ap
            JOIN URI u ON ap.URI = u.id
            WHERE u.domain = $1 
                AND u.path = $2 
                AND ap.type IN ('navigation', 'load')
                AND ap.created_at >= $3::date
                AND ap.created_at <= $4::date
            GROUP BY ${dateGrouping}
            ORDER BY period ASC
        `

        const params = [domain, path, from_date, to_date]
        const result = await run(query, params)

        const stats = result.rows.map(row => ({
            period: row.period,
            navigation: row.navigation_avg ? parseFloat(row.navigation_avg) : null,
            load: row.load_avg ? parseFloat(row.load_avg) : null
        }))

        return reply.send({
            domain,
            path,
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
