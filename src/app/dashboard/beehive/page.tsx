import config from '@config'
import { AnalyticsWrapper } from '@components/analytics/wrapper'

export default async function Home() {
    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>BeeHive</h1>
            <AnalyticsWrapper domain={config.domains.beehive} />
        </div>
    )
}
