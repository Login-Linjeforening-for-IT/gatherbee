import { NextResponse } from 'next/server'
import config from '@config'

export async function GET() {

    const state = Math.random().toString(36).substring(5)
    const authQueryParams = new URLSearchParams({
        client_id: config.AUTHENTIK.CLIENT_ID as string,
        redirect_uri: config.AUTH.REDIRECT_URL as string,
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
    }).toString()

    return NextResponse.redirect(
        `${config.AUTHENTIK.AUTH_URL}?${authQueryParams}`
    )
}