import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface UniqueVisitorQuery {
    domain: string
    path: string
    from_date: string
    to_date: string
    group_by?: 'day' | 'week' | 'month'
}

export default async function getVisitors(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { domain, path, from_date, to_date, group_by = 'day' } = request.query as UniqueVisitorQuery

        if (!domain || !path || !from_date || !to_date) {
            return reply.status(400).send({
                error: 'Missing required parameters: domain, path, from_date, to_date'
            })
        }

        let query: string

        const dateGrouping = {
            day: 'DATE(auv.created_at)',
            week: 'DATE_TRUNC(\'week\', auv.created_at)',
            month: 'DATE_TRUNC(\'month\', auv.created_at)'
        }[group_by] || 'DATE(auv.created_at)'

        query = `
            SELECT 
                ${dateGrouping} as period,
                COUNT(DISTINCT auv.id) as unique_visitors,
                COUNT(ap.id) as total_visits
            FROM analytics_unique_visitors auv
            JOIN URI u ON auv.URI = u.id
            LEFT JOIN analytics_performances ap ON ap.URI = u.id AND ${dateGrouping.replace('auv.created_at', 'ap.created_at')} = ${dateGrouping}
            WHERE u.domain = $1 AND u.path = $2
        `
        const params = [domain, path]

        const finalParams = [...params]

        if (from_date) {
            query += ' AND auv.created_at >= $3::date AND (ap.created_at IS NULL OR ap.created_at >= $3::date)'
            finalParams.push(from_date)
        }

        if (to_date) {
            query += ' AND auv.created_at < ($4::date + INTERVAL \'1 day\') AND (ap.created_at IS NULL OR ap.created_at < ($4::date + INTERVAL \'1 day\'))'
            finalParams.push(to_date)
        }

        query += `
            GROUP BY ${dateGrouping}
            ORDER BY period ASC
        `

        const result = await run(query, finalParams)

        const stats = result.rows.map(row => ({
            period: row.period,
            unique_visitors: parseInt(row.unique_visitors),
            total_visits: parseInt(row.total_visits)
        }))

        return reply.send({
            domain,
            path,
            group_by,
            from_date,
            to_date,
            stats
        })

    } catch (error) {
        console.error('Error fetching unique visitor stats:', error)
        return reply.status(500).send({
            error: 'Internal server error'
        })
    }
}
