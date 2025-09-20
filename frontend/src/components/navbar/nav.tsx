import ThemeSwitch from '../theme/themeSwitch'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { LogOut } from 'lucide-react'
import LoginLogoSmall from '@components/navbar/LoginLogoSmall'

export default function Nav() {
    return (
        <nav className='relative h-[var(--h-navbar)] w-full bg-login-950 flex justify-between' >
            <LeftSide />
            <RightSide />
        </nav>
    )
}

async function LeftSide() {
    return (
        <div className='flex gap-4'>
            <div className='relative h-[var(--h-navbar)] w-[45px]'>
                <Link href='/'>
                    <LoginLogoSmall />
                </Link>
            </div>
            <h1 className='self-center font-semibold '>GatherBee - Analytics Platform</h1>
        </div>
    )
}

async function RightSide() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || undefined
    return (
        <div className='flex gap-[1rem] items-center pr-[1rem]'>
            <ThemeSwitch />
            {token ? (
                <Link
                    className={
                        'flex align-middle gap-[0.5rem] ' +
                        'hover:*:text-login hover:*:stroke-login'
                    }
                    href={token ? '/logout' : '/login'}
                >
                    <LogOut className='w-5' />
                    <h1>Logout</h1>
                </Link>
            ) : (
                <></>
            )}
        </div>
    )
}
