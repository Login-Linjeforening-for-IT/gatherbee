import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const token = url.searchParams.get('access_token')
    if (!token) {
        return NextResponse.json({ error: 'No access token provided' }, { status: 400 })
    }

    const accessToken = url.searchParams.get('access_token')!
    const accessTokenExpires = url.searchParams.get('access_token_expires')!
    const refreshToken = url.searchParams.get('refresh_token')!
    const refreshTokenExpires = url.searchParams.get('refresh_token_expires')!
    const userId = url.searchParams.get('user_id')!
    const userName = url.searchParams.get('user_name')!
    const userRoles = url.searchParams.get('user_roles')!

    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.cookies.set('access_token', accessToken, { path: '/', sameSite: 'lax' })
    response.cookies.set('access_token_expires', accessTokenExpires, { path: '/', sameSite: 'lax' })
    response.cookies.set('refresh_token', refreshToken, { path: '/', sameSite: 'lax' })
    response.cookies.set('refresh_token_expires', refreshTokenExpires, { path: '/', sameSite: 'lax' })
    response.cookies.set('user_id', userId, { path: '/', sameSite: 'lax' })
    response.cookies.set('user_name', userName, { path: '/', sameSite: 'lax' })
    response.cookies.set('user_roles', userRoles, { path: '/', sameSite: 'lax' })

    return response
}