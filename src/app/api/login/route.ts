import { NextResponse } from 'next/server'
import config from '@config'

export async function GET() {

    const state = Math.random().toString(36).substring(5)
    const authQueryParams = new URLSearchParams({
        client_id: config.authentik.CLIENT_ID as string,
        redirect_uri: config.auth.REDIRECT_URI as string,
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
    }).toString()

    return NextResponse.redirect(
        `${config.authentik.AUTH_URI}?${authQueryParams}`
    )
}