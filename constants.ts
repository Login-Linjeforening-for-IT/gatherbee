import packageInfo from './package.json'

const env = process.env

const config = {
    URL: {
        FRONTEND: env.URL,
        API: env.API_URL,
        GITLAB_URL: 'https://gitlab.login.no',
    },
    DOMAINS: {
        BEEHIVE: 'beehive.login.no',
        STUDENTBEE: 'exam.login.no',
        GATHERBEE: 'gatherbee.login.no',
    },
    AUTH: {
        LOGIN_URL: `${env.URL}/api/login`,
        REDIRECT_URL: `${env.URL}/api/callback`,
        TOKEN_URL: `${env.URL}/api/token`,
        LOGOUT_URL: `${env.URL}/api/logout`,
    },
    AUTHENTIK: {
        CLIENT_ID: env.AUTHENTIK_CLIENT_ID,
        CLIENT_SECRET: env.AUTHENTIK_CLIENT_SECRET,
        AUTH_URL: `${env.AUTHENTIK_URL}/application/o/authorize/`,
        TOKEN_URL: `${env.AUTHENTIK_URL}/application/o/token/`,
        USERINFO_URL: `${env.AUTHENTIK_URL}/application/o/userinfo/`,
    },
    version: packageInfo.version,
}

export default config
