import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

interface UniqueVisitorQuery {
    domain: string
    path?: string
    from_date: string
    to_date: string
    group_by?: 'day' | 'week' | 'month'
}

export default async function getVisitors(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { domain, path, from_date, to_date, group_by = 'day' } = request.query as UniqueVisitorQuery

        if (!domain || !from_date || !to_date) {
            return reply.status(400).send({
                error: 'Missing required parameters: domain, from_date, to_date'
            })
        }

        let query: string
        let params: (string | null)[]

        const dateGrouping = {
            day: 'DATE(auv.created_at)',
            week: 'DATE_TRUNC(\'week\', auv.created_at)',
            month: 'DATE_TRUNC(\'month\', auv.created_at)'
        }[group_by] || 'DATE(auv.created_at)'

        if (path !== undefined && path !== null) {
            query = `
                SELECT 
                    ${dateGrouping} as period,
                    COUNT(*) as unique_visitors
                FROM analytics_unique_visitors auv
                JOIN URI u ON auv.URI = u.id
                WHERE u.domain = $1 AND u.path = $2
            `
            params = [domain, path]
        } else {
            query = `
                SELECT 
                    ${dateGrouping} as period,
                    COUNT(*) as unique_visitors
                FROM analytics_unique_visitors auv
                JOIN URI u ON auv.URI = u.id
                WHERE u.domain = $1 AND u.path IS NULL
            `
            params = [domain]
        }

        if (from_date) {
            query += ` AND auv.created_at >= $${params.length + 1}::date`
            params.push(from_date)
        }

        if (to_date) {
            query += ` AND auv.created_at < ($${params.length + 1}::date + INTERVAL '1 day')`
            params.push(to_date)
        }

        query += `
            GROUP BY ${dateGrouping}
            ORDER BY period ASC
        `

        const result = await run(query, params)

        const stats = result.rows.map(row => ({
            period: row.period,
            unique_visitors: parseInt(row.unique_visitors)
        }))

        return reply.send({
            domain,
            path: path !== undefined ? path : null,
            group_by,
            from_date: from_date || null,
            to_date: to_date || null,
            stats
        })

    } catch (error) {
        console.error('Error fetching unique visitor stats:', error)
        return reply.status(500).send({
            error: 'Internal server error'
        })
    }
}
