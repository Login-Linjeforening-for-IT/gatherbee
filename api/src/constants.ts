import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

const requiredEnvironmentVariables = [
    'AUTHENTIK_API_URL',
    'CLIENT_ID',
    'REDIRECT_URI',
    'CLIENT_SECRET',
    'DB_PASSWORD',
    'DB_HOST',
]

const missingVariables = requiredEnvironmentVariables.filter(
    (key) => !process.env[key]
)

if (missingVariables.length > 0) {
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

const AUTH_URL = `${env.AUTHENTIK_API_URL}/application/o/authorize/`
const TOKEN_URL = `${env.AUTHENTIK_API_URL}/application/o/token/`

const config = {
    USERINFO_URL: `${env.AUTHENTIK_API_URL}/application/o/userinfo/`,
    DB_PORT: env.DB_PORT,
    DB_MAX_CONN: env.DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS: env.DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS: env.DB_TIMEOUT_MS,
    DB: env.DB,
    DB_HOST: env.DB_HOST,
    DB_USER: env.DB_USER,
    DB_PASSWORD: env.DB_PASSWORD,
    CLIENT_ID: env.CLIENT_ID,
    REDIRECT_URI: env.REDIRECT_URI,
    TOKEN_URL,
    CLIENT_SECRET: env.CLIENT_SECRET,
    AUTH_URL,
}

export default config
