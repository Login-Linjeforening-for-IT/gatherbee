import { getPerformance, getVisitors, getTopStats } from '@utils/api'
import Graph from './graph'
import Paths from './paths'
import Options from './options'
import Tile from './tile'

type AnalyticsWrapperProps = {
    domain: string
    path: string
    from_date?: string
    to_date?: string
    visits_range?: Group_By
    pageviews_range?: Group_By
    navigation_range?: Group_By
    load_range?: Group_By
}

export async function AnalyticsWrapper({domain, path, from_date, to_date, visits_range, pageviews_range, navigation_range, load_range}: AnalyticsWrapperProps) {
    const now = new Date()
    from_date = from_date || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    to_date = to_date || now.toISOString().split('T')[0]

    const performanceResult = await getPerformance({domain, path, from_date, to_date, group_by: 'day'})
    const visitorsResult = await getVisitors({domain, path, from_date, to_date, group_by: 'day'})
    const topStatsResult = await getTopStats(domain, {
        visits_range: visits_range || 'month',
        pageviews_range: pageviews_range || 'month',
        navigation_range: navigation_range || 'month',
        load_range: load_range || 'month'
    })

    const performance = typeof performanceResult !== 'string' ? performanceResult : {stats: []}
    const visitors = typeof visitorsResult !== 'string' ? visitorsResult : {stats: []}
    const topStats = typeof topStatsResult !== 'string' ? topStatsResult.stats : {
        total_visits: 0,
        total_pageviews: 0,
        average_full_load: 0,
        average_navigation_load: 0
    }

    return (
        <div className='flex flex-row gap-20 p-4 h-full w-full'>
            <Paths domain={domain} selectedPath={path} />
            <div className='flex flex-1 flex-col w-full items-center'>
                <div className='flex flex-row gap-1 justify-between w-full'>
                    <Tile title='Total Visits' data={topStats.total_visits} dataSuffix='visits' searchParamKey='visits_range' />
                    <Tile title='Total Pageviews' data={topStats.total_pageviews} dataSuffix='pageviews' searchParamKey='pageviews_range' />
                    <Tile title='Avg Full Load' data={topStats.average_full_load} dataSuffix='ms' searchParamKey='load_range' />
                    <Tile title='Avg Navigation Load' data={topStats.average_navigation_load} dataSuffix='ms' searchParamKey='navigation_range' />
                </div>
                <div className='flex flex-col w-full justify-end h-full'>
                    <Graph
                        datasets={[
                            {
                                label: 'Total Visits',
                                data: visitors.stats,
                                dateProperty: 'period',
                                valueProperty: 'total_visits',
                                borderColor: '#fd8738'
                            },
                            {
                                label: 'Unique Visitors',
                                data: visitors.stats,
                                dateProperty: 'period',
                                valueProperty: 'unique_visitors',
                                borderColor: '#fc6703'
                            }
                        ]}
                        title='Visit Statistics'
                        xAxisLabel='Date'
                        yAxisLabel='Visits'
                    />
                    <Graph
                        datasets={[
                            {
                                label: 'Navigation Load',
                                data: performance.stats,
                                dateProperty: 'period',
                                valueProperty: 'navigation',
                                borderColor: '#fd8738'
                            },
                            {
                                label: 'Full Load',
                                data: performance.stats,
                                dateProperty: 'period',
                                valueProperty: 'load',
                                borderColor: '#fc6703'
                            }
                        ]}
                        title='Loadtimes'
                        xAxisLabel='Date'
                        yAxisLabel='Average Duration (ms)'
                    />
                    <Options from_date={from_date} to_date={to_date} />
                </div>
            </div>
        </div>
    )
}