'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

type TileProps = {
    title: string
    options?: string[]
    group_by?: Group_By
    data: number
    dataSuffix?: string
    searchParamKey: string
}

export default function Tile({title, data, dataSuffix, group_by, searchParamKey}: TileProps) {
    const groups: Group_By[] = ['day', 'week', 'month']
    const [isOpen, setIsOpen] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentGroup = group_by || searchParams.get(searchParamKey) || 'month'

    const handleSelect = (group: Group_By) => {
        const params = new URLSearchParams(searchParams)
        params.set(searchParamKey, group)
        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    return (
        <div className='w-2xs h-full flex gap-2 flex-col items-center justify-center p-6 bg-login-500/50 rounded-lg'>
            <h1 className='flex items-center gap-2'>
                {title}
                <span className='text-login-200'>|</span>
                <div className='relative inline-block'>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='text-current hover:opacity-80 transition-all duration-200 flex items-center gap-1'
                    >
                        {currentGroup}
                        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                            <ChevronDown className='w-4 h-4' />
                        </span>
                    </button>
                    {isOpen && (
                        <div className='absolute top-full left-0 mt-1 bg-login-500 rounded-lg shadow-lg z-10 min-w-full'>
                            {groups.map(group => (
                                <button
                                    key={group}
                                    onClick={() => handleSelect(group)}
                                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-login-400 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                                        group === currentGroup ? 'bg-login-400' : ''
                                    }`}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </h1>
            <p className='bg-login-500 p-2 rounded-lg'>
                {data} {dataSuffix}
            </p>
        </div>
    )
}