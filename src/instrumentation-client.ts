import { sendPerformanceData, sendVisitData } from '@utils/analytics'
import { getCookie, setCookie } from '@utils/cookies'
import { startTransition } from 'react'

performance.mark('app-init')
console.log('Analytics initialized')

function sendVisitorData(pathname: string) {
    const visitedPaths = new Set<string>(JSON.parse(getCookie('visited_paths') ?? '[]'))

    if (visitedPaths.size < 1) {
        startTransition(() => {
            sendVisitData()
        })
    }

    if (!visitedPaths.has(pathname)) {
        visitedPaths.add(pathname)
        const now = new Date()
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        const hoursUntilEndOfDay = (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        setCookie('visited_paths', JSON.stringify(Array.from(visitedPaths)), hoursUntilEndOfDay)

        startTransition(() => {
            sendVisitData(pathname)
        })
    }
}

function logLoadTime(pathname: string) {
    const entries = performance.getEntriesByName(`nav-start-${pathname}`)
    if (entries.length > 0) {
        const startEntry = entries[entries.length - 1]
        const duration = performance.now() - startEntry.startTime
        startTransition(() => {
            sendPerformanceData(pathname, Math.round(duration), 'navigation')
        })
        performance.clearMarks(`nav-start-${pathname}`)
    } else {
        const duration = performance.now()
        startTransition(() => {
            sendPerformanceData(pathname, Math.round(duration), 'load')
        })
    }
}

let currentPathname = ''
let isBackNavigation = false
setInterval(() => {
    if (window.location.pathname !== currentPathname) {
        if (!isBackNavigation) {
            currentPathname = window.location.pathname
            logLoadTime(currentPathname)
            sendVisitorData(currentPathname)
        } else {
            currentPathname = window.location.pathname
            sendVisitorData(currentPathname)
            isBackNavigation = false
        }
    }
}, 100)

window.addEventListener('popstate', () => {
    performance.clearMarks(`nav-start-${window.location.pathname}`)
    isBackNavigation = true
})

export function onRouterTransitionStart(url: string) {
    performance.mark(`nav-start-${url}`)
}
