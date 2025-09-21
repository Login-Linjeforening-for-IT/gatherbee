import Image from 'next/image'

export default function page() {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <Image
                src='/images/notFound.gif'
                width={500}
                height={500}
                alt='Not found - Breaking Bad Gif'
            />
            <p className='p-[2rem]'>
                This site does not exist. This will not be fixed until TekKom gets more pizza...
            </p>
        </div>
    )
}
