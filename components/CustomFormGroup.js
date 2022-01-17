import React from 'react'

export default function CustomFormGroup({children}) {
    return (
        <div className="flex flex-col space-y-2">
            {children}
        </div>
    )
}
