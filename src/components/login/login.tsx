'use client'

import { LogIn } from 'lucide-react'
import Link from 'next/link'

const loginUrl = `${process.env.NEXT_PUBLIC_BROWSER_API}/oauth2/login`

export default function Login() {

    return (
        <Link
            href={loginUrl}
            className='grid place-items-center'
        >
            <button
                className={
                    'flex align-middle gap-2 mt-2 rounded-lg ' +
                    'bg-login px-8 py-1  hover:bg-orange-500 mb-2'
                }
            >
                Login
                <LogIn className='w-5' />
            </button>
        </Link>
    )
}
