import React from 'react'

export default function Tag({type, className, children,...rest}) {
    return (

        <div className={`w-36 py-2 rounded-full border my-3 text-center
        ${type=='error'? 'border-rose-500 text-rose-500':'border-green-500 text-green-500'} ${className}`}>
                {children}
        </div>
    )
}
