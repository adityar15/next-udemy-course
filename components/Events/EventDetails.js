import {Title} from '@adiranids/react-tailwind'
import '@adiranids/react-tailwind/dist/style.css'
import moment from 'moment'
import dynamic from 'next/dynamic'
const Tag = dynamic(()=>import(/*webpackChunkName: "tag"*/'../Tag'))

export default function EventDetails({event}) {
    return (
        <div className="p-5 space-y-4 flex md:flex-row flex-col justify-between md:items-center">
                    <div>
                        <Title size="h1">{event.name}</Title>
                        <Tag type={event.is_online ? 'success' : 'error'}>{event.is_online ? "Online Event" : "Offline Event"}</Tag>
                        <Title size="h3" className="font-bold">{event.currency} {event.price}</Title>
                    </div>
                    <Title size="h3">{moment(event.date).format('LL')}</Title>
        </div>
    )
}
