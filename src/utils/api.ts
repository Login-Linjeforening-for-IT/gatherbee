'use server'

import config from '@config'
import { cookies } from 'next/headers'

const baseUrl = config.URL.API

type WrapperProps = {
    path: string
    options?: object
}

// Preformence
export async function getPaths(domain: string): Promise<GetPathsProps | string> {
    const queryParts = new URLSearchParams({
        domain: String(domain),
    })

    const path = `/api/uri/paths?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getPerformance({domain, path, from_date, to_date, group_by = 'day'}: GetStatsPathProps): Promise<StatsResponse | string> {
    const queryParts = new URLSearchParams({
        domain: String(domain),
        path: String(path),
        from_date: String(from_date),
        to_date: String(to_date),
        group_by: String(group_by),
    })

    const statsPath = `/api/performance?${queryParts.toString()}`
    return await getWrapper({ path: statsPath })
}

export async function getVisitors({domain, path, from_date, to_date, group_by = 'day'}: GetVisitorsProps): Promise<VisitorsResponse | string> {
    const queryParts = new URLSearchParams({
        domain: String(domain),
        path: String(path),
        from_date: String(from_date),
        to_date: String(to_date),
        group_by: String(group_by),
    })

    const visitorsPath = `/api/visitors?${queryParts.toString()}`
    return await getWrapper({ path: visitorsPath })
}

export async function getTopStats(
    domain: string,
    options?: {
        visits_range?: 'day' | 'week' | 'month'
        pageviews_range?: 'day' | 'week' | 'month'
        navigation_range?: 'day' | 'week' | 'month'
        load_range?: 'day' | 'week' | 'month'
    }
): Promise<TopStatsResponse | string> {
    const queryParts = new URLSearchParams({
        domain: String(domain),
        ...(options?.visits_range && { visits_range: String(options.visits_range) }),
        ...(options?.pageviews_range && { pageviews_range: String(options.pageviews_range) }),
        ...(options?.navigation_range && { navigation_range: String(options.navigation_range) }),
        ...(options?.load_range && { load_range: String(options.load_range) }),
    })

    const statsPath = `/api/stats/top?${queryParts.toString()}`
    return await getWrapper({ path: statsPath })
}

async function getWrapper({ path, options = {} }: WrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const token = access_token

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }

    const defaultOptions = { method: 'GET', headers }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${baseUrl}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        console.log(error)
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}