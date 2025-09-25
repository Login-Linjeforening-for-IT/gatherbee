import packageInfo from './package.json'

const isServer = typeof window === 'undefined'
const requiredEnvironmentVariables = [
    'NEXT_PUBLIC_URI',
    'NEXT_PUBLIC_API_URI',
    'NEXT_PUBLIC_AUTHENTIK_CLIENT_ID',
    'AUTHENTIK_CLIENT_SECRET',
    'NEXT_PUBLIC_AUTHENTIK_URI',
]

const missingVariables = requiredEnvironmentVariables.filter(
    (key) => !process.env[key]
)

if (isServer && missingVariables.length > 0) {
    throw new Error(
        'Missing essential environment variables:\n' +
            missingVariables
                .map((key) => `${key}: ${process.env[key] || 'undefined'}`)
                .join('\n')
    )
}

const env = Object.fromEntries(
    requiredEnvironmentVariables.map((key) => [key, process.env[key]])
)

const config = {
    url: {
        GITLAB_URL: 'https://gitlab.login.no',
        GATHERBEE_API: env.NEXT_PUBLIC_API_URI,
    },
    domains: {
        beehive: 'beehive.login.no',
        studentbee: 'exam.login.no',
        gatherbee: 'gatherbee.login.no',
    },
    auth: {
        LOGIN_URI: `${env.NEXT_PUBLIC_URI}/api/login`,
        REDIRECT_URI: `${env.NEXT_PUBLIC_URI}/api/callback`,
        TOKEN_URI: `${env.NEXT_PUBLIC_URI}/api/token`,
        LOGOUT_URI: `${env.NEXT_PUBLIC_URI}/api/logout`,
    },
    authentik: {
        CLIENT_ID: env.NEXT_PUBLIC_AUTHENTIK_CLIENT_ID,
        CLIENT_SECRET: env.AUTHENTIK_CLIENT_SECRET,
        AUTH_URI: `${env.NEXT_PUBLIC_AUTHENTIK_URI}/application/o/authorize/`,
        TOKEN_URI: `${env.NEXT_PUBLIC_AUTHENTIK_URI}/application/o/token/`,
        USERINFO_URI: `${env.NEXT_PUBLIC_AUTHENTIK_URI}/application/o/userinfo/`,
    },
    version: packageInfo.version,
}

export default config
