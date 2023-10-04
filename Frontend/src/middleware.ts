import { Ewert } from 'next/font/google'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/Login', request.url))
  }
  if (request.nextUrl.pathname === '/skills') {
    return NextResponse.redirect(new URL('/Skills', request.url))
  }
  else {
    return NextResponse.next()
  }
}
