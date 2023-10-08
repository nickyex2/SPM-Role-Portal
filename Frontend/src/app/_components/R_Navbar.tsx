'use client';

import React, {useEffect} from 'react';
import { Button, Navbar } from 'flowbite-react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { useRouter, usePathname } from 'next/navigation';

export default function R_Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [staff, setStaff] = React.useState<string>('');
  useEffect(() => {
    setStaff(sessionStorage.getItem('staff_id') as string);
  }, [])
  
  return (
    <Navbar
      fluid
      rounded
      className='sticky top-0 z-50'
    >
      <Navbar.Brand href="https://flowbite-react.com">
        {/* <img
          alt="Flowbite React Logo"
          className="mr-3 h-6 sm:h-9"
          src="/favicon.svg"
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          All-In-One
        </span>
      </Navbar.Brand>
      
      <Navbar.Collapse>
        <Navbar.Link
          active
          href="#"
        >
          {/* <p>
            Home
          </p> */}
        </Navbar.Link>
        <Navbar.Link href="/listroles">
          Jobs
        </Navbar.Link>
        <Navbar.Link href="/Skills">
          Skills
        </Navbar.Link>
      </Navbar.Collapse>

      <div className="flex md:order-2">
        <div className='hidden md:flex order-2'>
          {!staff ? 
          <Button onClick={() => {
            router.push('/Login');
          }}>
          Login
          </Button> : 
          <Button onClick={() => {
            sessionStorage.clear();
            router.push('/Login')
          }}>
          Logout
          </Button>
          }
          <ThemeSwitcher />
        </div>
        <Navbar.Toggle />
      </div>
      
    </Navbar>
  )
}


