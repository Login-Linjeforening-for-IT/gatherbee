import Link from 'next/link'
import { getPaths } from '@utils/api'

type Tree = { [key: string]: Tree }

function buildTree(paths: string[]): Tree {
    const tree: Tree = { '/': {} }
    for (const path of paths) {
        if (!path || typeof path !== 'string' || path === '/') continue
        const parts = path.split('/').filter(p => p)
        let current = tree['/']
        for (const part of parts) {
            if (!current[part]) {
                current[part] = {}
            }
            current = current[part]
        }
    }
    return tree
}

function getDisplayPath(tree: Tree): string {
    if (Object.keys(tree).length === 0) return ''
    if (Object.keys(tree).length === 1) {
        const [key, subtree] = Object.entries(tree)[0]
        return key + (Object.keys(subtree).length > 0 ? '/' + getDisplayPath(subtree) : '')
    }
    return ''
}

function Tree({ tree, prefix = '', currentPath = '', selectedPath }: { tree: Tree, prefix?: string, currentPath?: string, selectedPath?: string }) {
    const entries = Object.entries(tree)
    return (
        <div className='font-mono'>
            {entries.map(([key, subtree], index) => {
                const isLast = index === entries.length - 1
                const connector = key === '/' ? '' : (isLast ? '└── ' : '├── ')
                const newPrefix = prefix + (isLast ? '    ' : '│   ')
                if (key === '/') {
                    const display = '/'
                    const path = '/'
                    const isSelected = selectedPath === path
                    const shouldRecurse = Object.keys(subtree).length > 0
                    return (
                        <div key={key} className='whitespace-pre'>
                            {prefix}{connector}
                            <Link
                                href={`?path=${encodeURIComponent(path)}`}
                                className={isSelected ? 'text-login font-semibold' : 'hover:text-login/90'}
                            >
                                {display}
                            </Link>
                            {shouldRecurse && <Tree tree={subtree} prefix='' currentPath={path} selectedPath={selectedPath} />}
                        </div>
                    )
                } else {
                    const collapsedPath = Object.keys(subtree).length > 0 ? getDisplayPath(subtree) : ''
                    const display = '/' + key + (collapsedPath ? '/' + collapsedPath : '')
                    const basePath = currentPath === '/' ? `/${key}` : `${currentPath}/${key}`
                    const path = basePath + (collapsedPath ? '/' + collapsedPath : '')
                    const isSelected = selectedPath === path
                    const shouldRecurse = Object.keys(subtree).length > 1
                    return (
                        <div key={key} className='whitespace-pre'>
                            {prefix}{connector}
                            <Link
                                href={`?path=${encodeURIComponent(path)}`}
                                className={isSelected ? 'text-login font-semibold' : 'hover:text-login/90'}
                            >
                                {display}
                            </Link>
                            {shouldRecurse && <Tree tree={subtree} prefix={newPrefix} currentPath={path} selectedPath={selectedPath} />}
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default async function Paths({ domain, selectedPath }: { domain: string, selectedPath: string }) {
    const data = await getPaths(domain)

    if (data === null || typeof data === 'string') {
        return <div>Error: {data}</div>
    }

    if (!data.paths || !Array.isArray(data.paths)) {
        return <div>Error: Invalid paths data</div>
    }

    const tree = buildTree(data.paths)

    return (
        <div>
            <h2 className='font-semibold text-lg pb-4'>Paths</h2>
            <Tree tree={tree} selectedPath={selectedPath} />
        </div>
    )
}