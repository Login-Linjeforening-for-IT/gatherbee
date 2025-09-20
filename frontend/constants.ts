import packageInfo from './package.json'

const {
    NEXT_PUBLIC_API_URL
} = process.env

const config = {
    url: {
        GITLAB_URL: 'https://gitlab.login.no',
        GATHERBEE: NEXT_PUBLIC_API_URL || 'https://gatherbee.login.no',
    },
    version: packageInfo.version,
}

export default config
