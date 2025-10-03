'use client'

import { sendPerformanceData, sendVisitData } from '@utils/analytics'
import { getCookie, setCookie } from '@utils/cookies'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function Instrumentation() {
    const pathname = usePathname()
    const currentPathnameRef = useRef('')
    const isBackNavigationRef = useRef(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const sendVisitorData = (pathname: string) => {
        const visitedPaths = new Set<string>(JSON.parse(getCookie('visited_paths') ?? '[]'))

        if (visitedPaths.size < 1) {
            sendVisitData()
        }

        if (!visitedPaths.has(pathname)) {
            visitedPaths.add(pathname)
            const now = new Date()
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
            const hoursUntilEndOfDay = (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            setCookie('visited_paths', JSON.stringify(Array.from(visitedPaths)), hoursUntilEndOfDay)

            sendVisitData(pathname)
        }
    }

    const logLoadTime = (pathname: string) => {
        const entries = performance.getEntriesByName(`nav-start-${pathname}`)
        if (entries.length > 0) {
            const startEntry = entries[entries.length - 1]
            const duration = performance.now() - startEntry.startTime
            sendPerformanceData(pathname, Math.round(duration), 'navigation')
            performance.clearMarks(`nav-start-${pathname}`)
        } else {
            const duration = performance.now()
            sendPerformanceData(pathname, Math.round(duration), 'load')
        }
    }

    const onRouterTransitionStart = (url: string) => {
        performance.mark(`nav-start-${url}`)
    }

    useEffect(() => {
        // Initialize analytics
        performance.mark('app-init')
        console.log('Analytics initialized')

        // Set up popstate listener for back navigation
        const handlePopState = () => {
            performance.clearMarks(`nav-start-${window.location.pathname}`)
            isBackNavigationRef.current = true
        }

        window.addEventListener('popstate', handlePopState)

        // Set up interval to check for pathname changes
        intervalRef.current = setInterval(() => {
            if (window.location.pathname !== currentPathnameRef.current) {
                if (!isBackNavigationRef.current) {
                    currentPathnameRef.current = window.location.pathname
                    logLoadTime(currentPathnameRef.current)
                    sendVisitorData(currentPathnameRef.current)
                } else {
                    currentPathnameRef.current = window.location.pathname
                    sendVisitorData(currentPathnameRef.current)
                    isBackNavigationRef.current = false
                }
            }
        }, 100)

        return () => {
            window.removeEventListener('popstate', handlePopState)
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    // Handle pathname changes from Next.js router
    useEffect(() => {
        if (pathname !== currentPathnameRef.current) {
            onRouterTransitionStart(pathname)
            currentPathnameRef.current = pathname
            logLoadTime(pathname)
            sendVisitorData(pathname)
        }
    }, [pathname])

    return null
}

// Export the transition start function for external use
export function onRouterTransitionStart(url: string) {
    performance.mark(`nav-start-${url}`)
}
