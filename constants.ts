import packageInfo from './package.json'

const isServer = typeof window === 'undefined'
const requiredEnvironmentVariables = [
    'NEXT_PUBLIC_GATHERBEE_API_URI',
    'NEXT_PUBLIC_GATHERBEE_URI',
    'NEXT_PUBLIC_AUTHENTIK_CLIENT_ID',
    'AUTHENTIK_CLIENT_SECRET',
    'NEXT_PUBLIC_AUTHENTIK_REDIRECT_URI',
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
        GATHERBEE_API: env.NEXT_PUBLIC_GATHERBEE_API_URI,
    },
    domains: {
        beehive: 'beehive.login.no',
        studentbee: 'exam.login.no',
        gatherbee: 'gatherbee.login.no',
    },
    authentik: {
        CLIENT_ID: env.NEXT_PUBLIC_AUTHENTIK_CLIENT_ID,
        CLIENT_SECRET: env.AUTHENTIK_CLIENT_SECRET,
        REDIRECT_URI: env.NEXT_PUBLIC_AUTHENTIK_REDIRECT_URI,
        LOGIN_URI: `${env.NEXT_PUBLIC_LOGIN_URI}`,
        API_URL: `${env.NEXT_PUBLIC_GATHERBEE_URI}/api/login`,
        AUTH_URL: `${env.NEXT_PUBLIC_AUTHENTIK_URI}/application/o/authorize/`,
        TOKEN_URL: `${env.NEXT_PUBLIC_AUTHENTIK_URI}/application/o/token/`,
        USERINFO_URL: `${env.NEXT_PUBLIC_AUTHENTIK_URI}/application/o/userinfo/`,

    },
    version: packageInfo.version,
}

export default config
