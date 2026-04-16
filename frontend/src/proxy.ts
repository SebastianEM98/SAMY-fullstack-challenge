// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_ROUTES = ['/login', '/backend/auth/login'];

// export function proxy(request: NextRequest) {
//     const token = request.cookies.get('token')?.value;
//     const { pathname } = request.nextUrl;

//     const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
//     const isBackend = pathname.startsWith('/backend');

//     // Proxy routes should never be intercepted by the middleware
//     if (isBackend) {
//         return NextResponse.next();
//     }

//     if (!token && !isPublic) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     if (token && pathname === '/login') {
//         return NextResponse.redirect(new URL('/users', request.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// };