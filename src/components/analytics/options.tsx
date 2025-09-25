'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type OptionsProps = {
    type?: 'navigation' | 'load'
    from_date?: string
    to_date?: string
}

export default function Options({type: initialType, from_date: initialFromDate, to_date: initialToDate}: OptionsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [type, setTypeState] = useState(searchParams.get('type') || initialType || 'navigation')
    const [from_date, setFromDateState] = useState(searchParams.get('from_date') || initialFromDate || '')
    const [to_date, setToDateState] = useState(searchParams.get('to_date') || initialToDate || '')

    function setParam(key: string, value: string, setter: (v: string) => void) {
        setter(value)
        const params = new URLSearchParams(searchParams)
        params.set(key, value)
        router.replace(`?${params.toString()}`)
    }

    function setDefaults(defaults: Record<string, string>) {
        const params = new URLSearchParams(searchParams)
        let changed = false
        for (const [key, def] of Object.entries(defaults)) {
            if (!params.has(key)) {
                params.set(key, def)
                changed = true
            }
        }
        if (changed) {
            router.replace(`?${params.toString()}`)
        }
    }

    useEffect(() => {
        setDefaults({ type: 'navigation', from_date: '', to_date: '' })
    }, [searchParams, router])

    return (
        <div className='w-full flex flex-row gap-2 justify-between'>
            <div className='flex flex-row items-center gap-2'>
                <div className='flex border border-gray-600 rounded-full overflow-hidden'>
                    <button
                        className={`px-4 py-2 rounded-full ${
                            type === 'navigation'
                                ? 'bg-login text-login-900'
                                : 'bg-login-800 text-login-100'
                        }`}
                        onClick={() => setParam('type', 'navigation', setTypeState)}
                    >
                        Navigation
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${
                            type === 'load'
                                ? 'bg-login text-login-900'
                                : 'bg-login-800 text-login-100'
                        }`}
                        onClick={() => setParam('type', 'load', setTypeState)}
                    >
                        Load
                    </button>
                </div>
            </div>
            <div className='flex flex-row items-center gap-2'>
                <label className='text-sm font-medium whitespace-nowrap'>From Date</label>
                <input type='date' value={from_date} onChange={e => setParam('from_date', e.target.value, setFromDateState)} className='block w-full' />
            </div>
            <div className='flex flex-row items-center gap-2'>
                <label className='text-sm font-medium whitespace-nowrap'>To Date</label>
                <input type='date' value={to_date} onChange={e => setParam('to_date', e.target.value, setToDateState)} className='block w-full' />
            </div>
        </div>
    )
}
