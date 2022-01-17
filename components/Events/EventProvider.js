import React, { createContext } from 'react'

export const EventContext = createContext()

export default function EventProvider({children, event}) {
    return (
        <EventContext.Provider value={event}>
                {children}
        </EventContext.Provider>
    )
}
