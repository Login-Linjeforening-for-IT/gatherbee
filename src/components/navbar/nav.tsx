import ThemeSwitch from '../theme/themeSwitch'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { LogOut } from 'lucide-react'
import LoginLogoSmall from '@components/navbar/LoginLogoSmall'

export default async function Nav() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || undefined

    return (
        <nav className='relative h-[var(--h-navbar)] w-full bg-login-950 flex justify-between' >
            <LeftSide token={token} />
            <RightSide token={token} />
        </nav>
    )
}

function LeftSide({ token }: { token: string | undefined }) {
    return (
        <div className='flex gap-4'>
            <div className='relative h-[var(--h-navbar)] w-[45px]'>
                <Link href={`${token ? '/dashboard' : '/'}`}>
                    <LoginLogoSmall />
                </Link>
            </div>
            <h1 className='self-center font-semibold '>GatherBee - Analytics Platform</h1>
        </div>
    )
}

function RightSide({ token }: { token: string | undefined }) {
    return (
        <div className='flex gap-[1rem] items-center pr-[1rem]'>
            <ThemeSwitch />
            {token && (
                <Link
                    className={
                        'flex align-middle gap-[0.5rem] ' +
                        'hover:*:text-login hover:*:stroke-login'
                    }
                    href='/api/logout'
                    prefetch={false}
                >
                    <LogOut className='w-5' />
                    <h1>Logout</h1>
                </Link>
            )}
        </div>
    )
}
