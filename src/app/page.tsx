import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Version from '@components/version/version'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import config from '@config'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <main className='h-full grid place-items-center p-4 relative'>
            <div>
                <h1 className='text-2xl font-bold text-login text-center'>
                    GatherBee
                </h1>
                <p className='mt-2 text-foreground text-center font-semibold text-login-300'>GatherBee</p>
                <Link
                    href={config.auth.LOGIN_URI}
                    className='grid place-items-center'
                >
                    <button
                        className={'flex align-middle gap-2 mt-2 rounded-lg bg-login px-8 py-1  hover:bg-orange-500 mb-2'}
                    >
                        Login
                        <LogIn className='w-5' />
                    </button>
                </Link>
            </div>
            <Version />
        </main>
    )
}
