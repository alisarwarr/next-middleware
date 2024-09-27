/*
   Middleware allows you to run code before a request is completed. Then,
   based on the incoming request, you can modify the response by rewriting,
   redirecting, modifying the request or response headers, or responding directly.
*/

//NEXT
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* If authenticated, prevent access to these pages */
const authenticated_restricted_pages: string[] = [
    '/signin', '/signup', '/forgot-password'
];
/* If not authenticated, prevent access to these pages */
const not_authenticated_restricted_pages: string[] = [
    '/profile-settings', '/payment-details'
];

export function middleware(request: NextRequest) {
    /* This function can be marked `async` if using `await` inside */

    const isAuthenticated = false;

    if (isAuthenticated) {
        if (request.nextUrl.pathname.startsWith('/abc')) {
            return NextResponse.redirect(new URL('/hello', request.url));
        }

        /* If authenticated, prevent access to these pages */
        if ([...authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    else {
        /* If not authenticated, prevent access to these pages */
        if ([...not_authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    /* Allow the request to proceed if no redirection is needed */
    return NextResponse.next();
}

/*
   Middleware will be invoked for every route in your project. Given this,
   it's crucial to use matchers to precisely target or exclude specific routes.
   The following is the execution order:
*/
/*
   Good to know: The matcher values need to be constants so they can be statically
   analyzed at build-time. Dynamic values such as variables will be ignored.
*/
export const config = {
    /* You can match a single path with an string syntax:
    matcher: '/abc',
    */
    /* You can match multiple paths with an array syntax: */
    matcher: [
        '/abc/:path*',
        '/signin/:path*', '/signup/:path*', '/forgot-password/:path*',
        '/profile-settings/:path*', '/payment-details/:path*'
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        * '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
        */
    ]
}