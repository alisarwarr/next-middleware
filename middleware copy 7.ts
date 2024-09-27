/*
   Middleware allows you to run code before a request is completed. Then,
   based on the incoming request, you can modify the response by rewriting,
   redirecting, modifying the request or response headers, or responding directly.
*/

//NEXT
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* If authenticated, prevent access to these pages */
let authenticated_restricted_pages: string[] = [
    '/signin',
    '/signup',
    '/forgot-password'
];
/* If not authenticated, prevent access to these pages */
let not_authenticated_restricted_pages: string[] = [
    '/profile-settings',
    '/payment-details'
];
/* If authenticated / not authenticated, always access to these pages */
let common_no_restricted_pages: string[] = [
    '/privacy-policy',
    '/terms-and-conditions'
];

export function middleware(request: NextRequest) {
    /* This function can be marked `async` if using `await` inside */
    console.log("middleware - begin", request.nextUrl.pathname);

    /* If authenticated / not authenticated, always access to these pages */
    if ([...common_no_restricted_pages].includes(request.nextUrl.pathname)) {
        console.log("middleware - common_no_restricted_pages");
        return NextResponse.next();
    }

    const isAuthenticated = false;

    if (isAuthenticated) {
        console.log("middleware - authenticated");
    
        if (request.nextUrl.pathname.startsWith('/abc')) {
            console.log("middleware - authenticated - abc");
            return NextResponse.redirect(new URL('/hello', request.url));
        }

        /* If authenticated, prevent access to these pages */
        if ([...authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            console.log("middleware - authenticated - authenticated_restricted_pages");
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    else {
        console.log("middleware - not authenticated");

        /* If not authenticated, prevent access to these pages */
        if ([...not_authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            console.log("middleware - not authenticated - not_authenticated_restricted_pages");
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    /* Allow the request to proceed if no redirection is needed */
    console.log("middleware - default");
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
        /* If authenticated, prevent access to these pages */
        '/signin/:path*',
        '/signup/:path*',
        '/forgot-password/:path*',
        /* If not authenticated, prevent access to these pages */
        '/profile-settings/:path*',
        '/payment-details/:path*',
        /* If authenticated / not authenticated, always access to these pages */
        '/privacy-policy',
        '/terms-and-conditions'
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