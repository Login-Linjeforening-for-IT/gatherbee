import type { Metadata } from 'next'
import 'uibee/styles'
import './globals.css'
import { cookies } from 'next/headers'
import Nav from '@/components/navbar/nav'
import Instrumentation from '@utils/instrumentation'

export const metadata: Metadata = {
    title: 'GatherBee',
    description: 'GatherBee - Analytics Platform',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang='en' className={`${theme} h-full`}>
            <body className='bg-login-700 h-full flex flex-col'>
                <header className='h-[var(--h-navbar)]'>
                    <Nav />
                </header>
                <main className='flex flex-1 overflow-hidden'>
                    <div className='w-full bg-login-800'>{children}</div>
                </main>
                <Instrumentation />
            </body>
        </html>
    )
}
