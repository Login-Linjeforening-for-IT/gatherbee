import { sendPerformanceData } from '@utils/analytics'
import { startTransition } from 'react'

performance.mark('app-init')
console.log('Analytics initialized')

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
        } else {
            currentPathname = window.location.pathname
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
