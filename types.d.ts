type Group_By = 'day' | 'week' | 'month'

type GetPathsProps = {
    domain: string
    paths: string[]
}

type GetStatsPathProps = {
    domain: string
    path: string
    from_date: string
    to_date: string
    group_by?: Group_By
}

type Stats = {
    period: string
    navigation: number
    load: number
}[]

type StatsResponse = GetStatsPathProps & {
    stats: Stats
}

type GetVisitorsProps = {
    domain: string
    path: string
    from_date: string
    to_date: string
    group_by?: Group_By
}

type VisitorStats = {
    period: string
    unique_visitors: number
    total_visits: number
}[]

type VisitorsResponse = {
    domain: string
    path: string | null
    group_by: string
    from_date: string | null
    to_date: string | null
    stats: VisitorStats
}

type TopStats = {
    total_visits: number
    total_pageviews: number
    average_full_load: number
    average_navigation_load: number
}

type TopStatsResponse = {
    stats: TopStats
}