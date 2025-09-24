import packageInfo from './package.json'

const NEXT_PUBLIC_GATHERBEE_API_URL = process.env.NEXT_PUBLIC_GATHERBEE_API_URL

const config = {
    url: {
        GITLAB_URL: 'https://gitlab.login.no',
        GATHERBEE_API: NEXT_PUBLIC_GATHERBEE_API_URL || 'https://gatherbee.login.no',
    },
    domains: {
        beehive: 'beehive.login.no',
        studentbee: 'exam.login.no',
        gatherbee: 'gatherbee.login.no',
    },
    version: packageInfo.version,
}

export default config
