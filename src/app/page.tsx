import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {LoginPage } from 'uibee/components'
import config from '@config'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <LoginPage
            title='GatherBee'
            description='Analytics and monitoring platform'
            redirectURI={config.AUTH.LOGIN_URL}
            version={config.version}
        />
    )
}
