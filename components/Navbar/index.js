/* This example requires Tailwind CSS v2.0+ */

import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { classNames } from '../../assets/classOperation'

import {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import auth from '../../assets/auth'
import { useRouter } from 'next/router'





const Logo = dynamic(()=>import('./Logo')) 
const NavLink = dynamic(()=>import('./NavLink')) 
const NotificationIcon = dynamic(()=>import('../NotificationIcon')) 
const LoggedInMenu = dynamic(()=>import('./LoggedInMenu')) 


export default function Navbar() {


    const guestRoutes = [
      { name: 'Events', href: '/', current: true },
      { name: 'Login', href: '/login', current: false },
      { name: 'Register', href: '/register', current: false },
    ]

    const authRoutes = [
      { name: 'Events', href: '/', current: true },
    ]

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    useEffect(()=>{
      const authStatus = new auth() 
      authStatus.checkAuthStatus(setIsLoggedIn, setIsLoading)
      // setIsLoading(true)
    },[])


    useEffect(()=>{
      setNavigation(!isLoggedIn ? guestRoutes : authRoutes)
    }, [isLoggedIn])

    const [navigation, setNavigation] = useState(!isLoggedIn ? guestRoutes : authRoutes)

    useEffect(()=>{
      let navItems = navigation.map(item=> ({name:item.name, href:item.href, current: item.href == router.route}))
      setNavigation(navItems)
    }, [router.route])



   
  return (
    <Disclosure as="nav" className="!bg-gray-800">
      {({ open }) => (
       <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                    <Logo />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {!isLoading && navigation.map((item) => (
                        <NavLink key={item.name} href={item.href} name={item.name} current={item.current} />
                    ))}
                  </div>
                </div>
              </div>
             {isLoggedIn && <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <NotificationIcon />
                {/* Profile dropdown */}
                <LoggedInMenu />
              </div>}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="div"
                 
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                   <Link href={item.href}>
                    {item.name}
                   </Link> 
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
