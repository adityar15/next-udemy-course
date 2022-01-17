import Link from "next/link";
import Image from 'next/image'
// event referes to event.data() and eventID refers to event.id
export default function EventCard({ event, eventID }) {
  return (
    <div className="group relative">
      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden 
      group-hover:opacity-75 lg:h-80 lg:aspect-none relative">
        <Image
          src={event.image}
          alt={event.name}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/events/${eventID}`}>
              <a>
                <span aria-hidden="true" className="absolute inset-0" />
                {event.name}
              </a>
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{event.date}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {" "}
          {event.currency} {event.price}
        </p>
      </div>
    </div>
  );
}
