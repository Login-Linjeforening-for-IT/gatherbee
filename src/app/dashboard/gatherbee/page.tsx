import config from '@config'
import { AnalyticsWrapper } from '@components/analytics/wrapper'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const params = await searchParams

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>Gatherbee</h1>
            <AnalyticsWrapper
                domain={config.domains.gatherbee}
                path={params.path || undefined}
                type={params.type as 'navigation' | 'load' || undefined}
                from_date={params.from_date || undefined}
                to_date={params.to_date || undefined}
            />
        </div>
    )
}