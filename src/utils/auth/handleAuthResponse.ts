import { setCookie } from '../cookies'

export default async function handleAuthResponse() {
    const url = window.location.href
    const query = new URLSearchParams(new URL(url).search)
    const token = query.get('access_token')

    if (!token) {
        return
    }

    const response = Object.fromEntries(query.entries())

    if (!response.tekkom_bot) {
        setCookie('access_token', response.access_token)
        setCookie('access_token_expires', response.access_token_expires)
        setCookie('refresh_token', response.refresh_token)
        setCookie('refresh_token_expires', response.refresh_token_expires)
        setCookie('user_id', response.user_id)
        setCookie('user_name', response.user_name)
        setCookie('user_roles', response.user_roles)
        return
    }

    const path = '/dashboard'
    window.location.href = path
}
