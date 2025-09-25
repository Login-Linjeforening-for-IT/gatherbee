'use server'

import config from '@config'
import { cookies } from 'next/headers'

const baseUrl = config.url.GATHERBEE_API

type WrapperProps = {
    path: string
    options?: object
}

// Preformence
export async function getPaths(domain: string): Promise<GetPathsProps | string> {
    const queryParts = new URLSearchParams({
        domain: String(domain),
    })

    const path = `/api/performance/paths?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getStatsPath({domain, path, type, from_date, to_date}: GetStatsPathProps): Promise<StatsResponse | string> {
    const queryParts = new URLSearchParams({
        domain: String(domain),
        path: String(path),
        type: String(type),
        from_date: String(from_date),
        to_date: String(to_date),
    })

    const statsPath = `/api/performance/stats?${queryParts.toString()}`
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

    console.log(`${baseUrl}${path}`)

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