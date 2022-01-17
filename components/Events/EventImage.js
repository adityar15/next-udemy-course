import React from 'react'
import Image from 'next/image'
export default function EventImage({url}) {
    return (
        <div className="w-full md:h-[300px] h-[200px] overflow-hidden relative">
            <Image layout="fill" objectFit='contain' objectPosition="center" src={url} alt="event image" />
        </div>
    )
}
