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

export default function Graph({data, type}: {data: Stats, type: 'visits' | 'duration'}) {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // label for Y axis depends on the chart `type`
    const yAxisLabel = type === 'visits' ? 'Visits' : 'Average Duration (ms)'

    const chartData = {
        labels: sortedData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: type === 'visits' ? 'Visits' : 'Average Duration',
                data: sortedData.map(item => type === 'visits' ? item.visits : item.avg_duration),
                borderColor: '#fd8738',
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx
                    const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height)
                    gradient.addColorStop(0, 'rgba(253, 135, 56, 0.4)')
                    gradient.addColorStop(0.5, 'rgba(253, 135, 56, 0.1)')
                    gradient.addColorStop(1, 'rgba(253, 135, 56, 0)')
                    return gradient
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
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
                    text: 'Date',
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
            <h2 className='font-semibold text-lg pb-4'>{type === 'visits' ? 'Visit Statistics' : 'Duration Statistics'}</h2>
            <div className='h-64 w-full'>
                <Line data={chartData} options={options} width='100%' height='100%' />
            </div>
        </div>
    )
}