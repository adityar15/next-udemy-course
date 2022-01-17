
import Link from "next/link";
import { classNames } from "../../assets/classOperation";

export default function NavLink({name, current, href, className,...rest}) {



  return (
    <div {...rest} className={classNames(
      current
    ? "bg-gray-900 text-white"
    : "text-gray-300 hover:bg-gray-700 hover:text-white","px-3 py-2 rounded-md text-sm font-medium"+className
      )}>
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
      >
        {name}
      </Link>
    </div>
  );
}
