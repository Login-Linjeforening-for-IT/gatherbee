'use client'

import { removeCookies } from '@/utils/cookies'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Login() {
    const router = useRouter()
    useEffect(() => {
        removeCookies(
            'access_token',
            'access_token_expires',
            'refresh_token',
            'refresh_token_expires',
            'user_id',
            'user_name',
            'user_roles'
        )
        router.push('/')
        // router.refresh()
    }, [])
}
