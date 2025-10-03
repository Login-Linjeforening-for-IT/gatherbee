import { NextRequest, NextResponse } from 'next/server'
import config from '@config'

export async function GET(request: NextRequest) {
    console.log(request.url)
    const response = NextResponse.redirect(new URL('/', config.URL.FRONTEND))

    // Remove all authentication cookies
    const cookiesToRemove = [
        'access_token',
        'access_token_expires',
        'refresh_token',
        'refresh_token_expires',
        'user_id',
        'user_name',
        'user_roles'
    ]

    cookiesToRemove.forEach(cookieName => {
        response.cookies.delete(cookieName)
    })

    return response
}
