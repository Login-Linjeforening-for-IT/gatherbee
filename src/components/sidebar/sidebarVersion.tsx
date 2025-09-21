import config from '@config'
import Link from 'next/link'

export default function SidebarVersion() {
    if (!config.version) {
        return <div />
    }

    return (
        <div className='absolute w-full bottom-4 flex'>
            <Link
                className={
                    ' gap-3 px-2 py-1 rounded-lg mx-4 bg-login-700 text-login-50 text-center tracking-wide font-bold'
                }
                target='_blank'
                href={`${config.url.GITLAB_URL}/tekkom/web/beehive/gatherbee/-/tags/${config.version}`}
                aria-label={`Gatherbee version ${config.version}`}
            >
                <span className='hidden md:inline'>v{config.version}</span>
            </Link>
        </div>
    )
}
