type TileProps = {
    title: string
    options?: string[]
    data: number
    dataSuffix?: string
}

export default function Tile({title, data, dataSuffix}: TileProps) {
    return (
        <div className='w-2xs h-full flex gap-2 flex-col items-center justify-center p-6 bg-login-500/50 rounded-lg'>
            <h1>
                {title}
            </h1>
            <p className='bg-login-500 p-2 rounded-lg'>
                {data} {dataSuffix}
            </p>
        </div>
    )
}