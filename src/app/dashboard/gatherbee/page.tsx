import config from '@config'
import { AnalyticsWrapper } from '@components/analytics/wrapper'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const params = await searchParams

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>Gatherbee</h1>
            <AnalyticsWrapper
                domain={config.domains.gatherbee}
                path={params.path || '/'}
                from_date={params.from_date || undefined}
                to_date={params.to_date || undefined}
                visits_range={params.visits_range as Group_By || undefined}
                pageviews_range={params.pageviews_range as Group_By || undefined}
                navigation_range={params.navigation_range as Group_By || undefined}
                load_range={params.load_range as Group_By || undefined}
            />
        </div>
    )
}