import config from '@config'
import { NextResponse } from 'next/server'

type UserInfo = {
    sub: string
    name: string
    email: string
    groups: string[]
}

export async function GET(req: Request) {
    const searchParams = new URL(req.url).searchParams

    if (!searchParams) {
        return NextResponse.json({ error: 'No search parameters found.' }, { status: 400 })
    }
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.json({ error: 'No authorization code found.' }, { status: 400 })
    }

    try {
        // Exchanges callback code for access token
        const tokenResponse = await fetch(config.authentik.TOKEN_URI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: config.authentik.CLIENT_ID as string,
                client_secret: config.authentik.CLIENT_SECRET as string,
                code: code as string,
                redirect_uri: config.auth.REDIRECT_URI as string,
                grant_type: 'authorization_code',
            }).toString()
        })

        const tokenResponseBody = await tokenResponse.text()

        if (!tokenResponse.ok) {
            return new Response(JSON.stringify(`Failed to obtain token: ${tokenResponseBody}`), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const token = JSON.parse(tokenResponseBody)

        // Fetches user info using access token
        const userInfoResponse = await fetch(config.authentik.USERINFO_URI, {
            headers: { Authorization: `Bearer ${token.access_token}` }
        })

        if (!userInfoResponse.ok) {
            const userInfoError = await userInfoResponse.text()
            return new Response(`No user info found: ${userInfoError}`, {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const userInfo = await userInfoResponse.json() as UserInfo

        const redirectUrl = new URL(`${config.auth.LOGIN_URI}`)
        const params = new URLSearchParams({
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            groups: userInfo.groups.join(','),
            access_token: token.access_token,
        })

        redirectUrl.search = params.toString()
        return NextResponse.redirect(redirectUrl.toString())
    } catch (err: unknown) {
        const error = err as Error
        console.error('Error during OAuth2 flow:', error.message)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
}