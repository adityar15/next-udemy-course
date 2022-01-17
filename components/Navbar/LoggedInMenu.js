import { Fragment, useContext, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../../assets/classOperation";
import Link from "next/link";
import dynamic from 'next/dynamic'
import { AuthContext } from "../../assets/auth";

import { getAuth, signOut } from "firebase/auth";

import {useRouter} from 'next/router'

const LoginNavLink = ({ href, className, children, isLogout = false }) => {

  const router = useRouter()
  function logout()
  {
 
      const auth = getAuth();
      signOut(auth).then(() => {
          router.reload()
      }).catch((error) => {
        // An error happened.
      });
    
  }


  return (
    <>
   {!isLogout && <Link href={href}>
      <a className={className}>{children}</a>
    </Link>}

    {isLogout && <button onClick={logout} className={`z-[9999] ${className}`}>{children}</button> }
    </>
  );
};

const navList = [
  { href: "/dashboard", name: "Your Profile", isLogout: false },
  { href: "/dashboard/createevent", name: "Create Event", isLogout: false },
  { href: "#", name: "Logout", isLogout: true },
];


const Avatar = dynamic(()=>import('../Avatar'))

export default function LoggedInMenu() {

  const [avatarURL, setURL] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")

const loggedInUser = useContext(AuthContext)

useEffect(() => {
    if(loggedInUser.photoURL)
    setURL(loggedInUser.photoURL)
}, [loggedInUser])



  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button
          className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          {/* change it to avatar component */}
          <span className="sr-only">Open user menu</span>
          <Avatar url={avatarURL} /> 

        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white 
                    ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {navList.map((item,index) => (
            <Menu.Item  key={index}>
              {({ active }) => (
                <LoginNavLink
                 
                  href={item.href}
                  isLogout={item.isLogout}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  {item.name}
                </LoginNavLink>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
