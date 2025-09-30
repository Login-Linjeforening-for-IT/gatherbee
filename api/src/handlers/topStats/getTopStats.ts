import { FastifyRequest, FastifyReply } from 'fastify'
import run from '../../db'

type Group_By = 'day' | 'week' | 'month'
interface StatsQuery {
    domain: string
    visits_range?: Group_By
    pageviews_range?: Group_By
    navigation_range?: Group_By
    load_range?: Group_By
}

export default async function getTopStats(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {
            domain,
            visits_range = 'month',
            pageviews_range = 'month',
            navigation_range = 'month',
            load_range = 'month'
        } = request.query as StatsQuery

        if (!domain) {
            return reply.status(400).send({
                error: 'Missing required parameter: domain'
            })
        }

        const getDateFilter = (range: Group_By, tableAlias: string) => {
            const filters = {
                day: `AND ${tableAlias}.created_at >= CURRENT_DATE - INTERVAL '1 day'`,
                week: `AND ${tableAlias}.created_at >= CURRENT_DATE - INTERVAL '7 days'`,
                month: `AND ${tableAlias}.created_at >= CURRENT_DATE - INTERVAL '30 days'`
            }
            return filters[range] || filters.month
        }

        const visitsDateFilter = getDateFilter(visits_range, 'auv')
        const pageviewsDateFilter = getDateFilter(pageviews_range, 'ap')
        const navigationDateFilter = getDateFilter(navigation_range, 'ap')
        const loadDateFilter = getDateFilter(load_range, 'ap')

        const query = `
            WITH visitor_stats AS (
                SELECT 
                    COUNT(*) as total_visits
                FROM analytics_unique_visitors auv
                JOIN URI u ON auv.URI = u.id
                WHERE u.domain = $1 
                    AND u.path IS NULL
                    ${visitsDateFilter}
            ),
            navigation_stats AS (
                SELECT 
                    AVG(ap.duration) as avg_navigation_duration
                FROM analytics_performances ap
                JOIN URI u ON ap.URI = u.id
                WHERE u.domain = $1 
                    AND ap.type = 'navigation'
                    ${navigationDateFilter}
            ),
            load_stats AS (
                SELECT 
                    AVG(ap.duration) as avg_load_duration
                FROM analytics_performances ap
                JOIN URI u ON ap.URI = u.id
                WHERE u.domain = $1
                    AND ap.type = 'load'
                    ${loadDateFilter}
            ),
            pageview_stats AS (
                SELECT 
                    COUNT(*) as total_pageviews
                FROM analytics_performances ap
                JOIN URI u ON ap.URI = u.id
                WHERE u.domain = $1
                    ${pageviewsDateFilter}
            )
            SELECT 
                COALESCE(vs.total_visits, 0) as total_visits,
                COALESCE(ps.total_pageviews, 0) as total_pageviews,
                COALESCE(ROUND(ls.avg_load_duration), 0) as average_full_load,
                COALESCE(ROUND(ns.avg_navigation_duration), 0) as average_navigation_load
            FROM visitor_stats vs
            CROSS JOIN navigation_stats ns
            CROSS JOIN load_stats ls  
            CROSS JOIN pageview_stats ps
        `

        const params = [domain]
        const result = await run(query, params)

        return reply.send({
            stats: result.rows[0] || {
                total_visits: 0,
                total_pageviews: 0,
                average_full_load: 0,
                average_navigation_load: 0
            }
        })

    } catch (error) {
        console.error('Error fetching top stats:', error)
        return reply.status(500).send({
            error: 'Internal server error'
        })
    }
}
