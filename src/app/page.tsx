import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Login from '@components/login/login'
import Version from '@components/version/version'

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
                <Login />
            </div>
            <Version />
        </main>
    )
}
