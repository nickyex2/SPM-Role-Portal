'use client';

import React from 'react';
import { Button, Navbar } from 'flowbite-react';
import { ThemeSwitcher } from '../ThemeSwitcher';

export default function R_Navbar() {
  return (
    <Navbar
      fluid
      rounded
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
        <Navbar.Link href="#">
          Jobs
        </Navbar.Link>
        <Navbar.Link href="#">
          Skills
        </Navbar.Link>
        {/* <Navbar.Link href="#">
          Pricing
        </Navbar.Link>
        <Navbar.Link href="#">
          Contact
        </Navbar.Link> */}
      </Navbar.Collapse>

      <div className="flex md:order-2">
        <div className='hidden md:flex order-2'>
          <Button>
          Login/Signup
          </Button>
          <ThemeSwitcher />
        </div>
        <Navbar.Toggle />
      </div>
      
    </Navbar>
  )
}


