'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type OptionsProps = {
    type?: 'navigation' | 'load'
    from_date?: string
    to_date?: string
}

export default function Options({from_date: initialFromDate, to_date: initialToDate}: OptionsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

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
        setDefaults({ from_date: '', to_date: '' })
    }, [searchParams, router])

    return (
        <div className='w-full flex flex-row gap-2 justify-between'>
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
