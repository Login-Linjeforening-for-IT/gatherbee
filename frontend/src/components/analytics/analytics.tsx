'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { NextWebVitalsMetric } from 'next/app'
import { useReportWebVitals } from 'next/dist/client/web-vitals'


export function LogPath() {
    const pathname = usePathname()
    useEffect(() => {
        console.log('Current Path:', pathname)
    }, [pathname])
}

export function LogLink({data}: {data: object}) {
    console.log('Link Clicked:', data)
}

export function LogExternalLink(href: string) {
    return {
        href,
        onClick: () => {
            const isExternal = href.startsWith('http') || href.startsWith('//')
            if (isExternal) {
                LogLink({
                    data: {
                        name: 'external-link:',
                        href
                    }
                })
            }
        }
    }
}

function logWebVitals(metric: NextWebVitalsMetric) {
    console.log(metric)
}

export function Analytics() {
    useReportWebVitals(logWebVitals)
    LogPath()

    return null
}