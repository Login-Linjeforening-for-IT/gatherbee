import { getStatsPath } from '@utils/api'
import Graph from './graph'
import Paths from './paths'
import Options from './options'

type AnalyticsWrapperProps = {
    domain: string
    path?: string
    type?: 'navigation' | 'load'
    from_date?: string
    to_date?: string
}

export async function AnalyticsWrapper({domain, path, type = 'navigation', from_date, to_date}: AnalyticsWrapperProps) {
    const now = new Date()
    from_date = from_date || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    to_date = to_date || now.toISOString().split('T')[0]

    const stats = await getStatsPath({domain, path, type, from_date, to_date})

    return (
        <div className='flex flex-row gap-20 p-4'>
            <Paths domain={domain} />
            {typeof stats !== 'string' && (
                <div className='flex flex-1 flex-col w-full items-center'>
                    <Graph data={stats.stats} type='visits' />
                    <Graph data={stats.stats} type='duration' />
                    <Options type={type} from_date={from_date} to_date={to_date} />
                </div>
            )}
        </div>
    )
}