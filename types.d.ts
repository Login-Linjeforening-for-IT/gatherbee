type GetPathsProps = {
    domain: string
    paths: string[]
}

type GetStatsPathProps = {
    domain: string
    path?: string
    type: 'navigation' | 'load'
    from_date: string
    to_date: string
}

type Stats = {
    date: string
    avg_duration: number
    visits: number
}[]

type StatsResponse = GetStatsPathProps & {
    stats: Stats
}