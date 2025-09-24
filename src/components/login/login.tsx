import { LogIn } from 'lucide-react'
import Link from 'next/link'
import config from '@config'

export default function Login() {

    const state = Math.random().toString(36).substring(5)
    const authQueryParams = new URLSearchParams({
        client_id: config.authentik.CLIENT_ID as string,
        redirect_uri: config.authentik.REDIRECT_URI as string,
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
    }).toString()

    return (
        <Link
            href={`${config.authentik.AUTH_URL}?${authQueryParams}`}
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
