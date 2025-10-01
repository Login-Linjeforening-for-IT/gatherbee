'use server'

import config from '@config'

export async function sendPerformanceData(pathname: string, duration: number, type: string) {
    try {
        await fetch(`${config.url.GATHERBEE_API}/api/performance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                domain: config.domains.gatherbee,
                pathname,
                duration,
                type,
            }),
        })
    } catch (error) {
        console.error('Failed to send performance data:', error)
    }
}

export async function sendVisitData(pathname?: string) {
    try {
        await fetch(`${config.url.GATHERBEE_API}/api/visitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                domain: config.domains.gatherbee,
                pathname,
            }),
        })
    } catch (error) {
        console.error('Failed to send visitor data:', error)
    }
}