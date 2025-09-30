'use client'

import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ScriptableContext,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

type DatasetConfig = {
    label: string
    data: Record<string, unknown>[]
    dateProperty: string
    valueProperty: string
    borderColor?: string
}

type GraphProps = {
    datasets: DatasetConfig[]
    title: string
    yAxisLabel: string
    xAxisLabel: string
    showLegend?: boolean
}

export default function Graph({datasets, title, yAxisLabel, xAxisLabel, showLegend = false}: GraphProps) {
    const allDates = new Set<string>()
    datasets.forEach(dataset => {
        dataset.data.forEach(item => {
            allDates.add(item[dataset.dateProperty] as string)
        })
    })
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    const chartDatasets = datasets.map((dataset, index) => {
        const sortedData = [...dataset.data].sort((a, b) =>
            new Date(a[dataset.dateProperty] as string).getTime() - new Date(b[dataset.dateProperty] as string).getTime()
        )

        // Create data array aligned with sortedDates
        const alignedData = sortedDates.map(date => {
            const item = sortedData.find(d => d[dataset.dateProperty] === date)
            return item ? (item[dataset.valueProperty] as number) : 0
        })

        const colors = [
            '#fd8738', // Orange
            '#38bdf8', // Blue
            '#10b981', // Green
            '#f59e0b', // Yellow
            '#ef4444', // Red
            '#8b5cf6', // Purple
        ]
        const color = dataset.borderColor || colors[index % colors.length]

        // Convert hex to rgba
        const hexToRgba = (hex: string, alpha: number) => {
            const r = parseInt(hex.slice(1, 3), 16)
            const g = parseInt(hex.slice(3, 5), 16)
            const b = parseInt(hex.slice(5, 7), 16)
            return `rgba(${r}, ${g}, ${b}, ${alpha})`
        }

        return {
            label: dataset.label,
            data: alignedData,
            borderColor: color,
            backgroundColor: (context: ScriptableContext<'line'>) => {
                const ctx = context.chart.ctx
                const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height)
                gradient.addColorStop(0, hexToRgba(color, 0.4))
                gradient.addColorStop(0.5, hexToRgba(color, 0.1))
                gradient.addColorStop(1, hexToRgba(color, 0))
                return gradient
            },
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
        }
    })

    const chartData = {
        labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
        datasets: chartDatasets,
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: showLegend || datasets.length > 1,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    color: '#ddd',
                },
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: xAxisLabel,
                    color: '#888',
                    font: {
                        size: 12,
                    },
                },
                ticks: {
                    color: '#ddd',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                display: true,
                beginAtZero: true,
                title: {
                    display: true,
                    text: yAxisLabel,
                    color: '#888',
                    font: {
                        size: 12,
                    },
                },
                ticks: {
                    color: '#ddd',
                },
                grid: {
                    display: false,
                },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },
    }

    return (
        <div className='w-full'>
            <h2 className='font-semibold text-lg pb-4'>{title}</h2>
            <div className='h-64 w-full'>
                <Line data={chartData} options={options} width='100%' height='100%' />
            </div>
        </div>
    )
}