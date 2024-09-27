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
    '/',
    '/privacy-policy',
    '/terms-and-conditions',
    '/company',
    '/company/internal-matters',
    '/home'
];

export function middleware(request: NextRequest) {
    /* This function can be marked `async` if using `await` inside */
    console.log("middleware - begin", request.nextUrl.pathname);

    const userCookie = request.cookies.get('user');
    const isAuthenticated = !!userCookie;

    if (isAuthenticated) {
        const user = JSON.parse(userCookie?.value || '{}');
        console.log("middleware - authenticated", user);

        if (user.status === 'subscribe') {
            console.log('middleware - authenticated - user.status - subscribe');
            return NextResponse.redirect(new URL('/membership', request.url));
        }
        if (user.status === 'verify') {
            console.log('middleware - authenticated - user.status - verify');
            return NextResponse.redirect(new URL('/verify', request.url));
        }
        if (user.status === 'auth-complete') {
            console.log('middleware - authenticated - user.status - auth-complete');
            return NextResponse.redirect(new URL('/complete', request.url));
        }

        /* If authenticated, prevent access to these pages */
        if ([...authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            console.log("middleware - authenticated - authenticated_restricted_pages");
            return NextResponse.redirect(new URL('/', request.url));
        }

        /* If authenticated, allow access to these pages */
        if ([...not_authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            console.log('middleware - authenticated - not_authenticated_restricted_pages');
            return NextResponse.next();
        }

        /* Redirect the request to page */
        console.log('middleware - not authenticated - common_no_restricted_pages - default');
        return NextResponse.next();
    }
    else {
        console.log("middleware - not authenticated");

        /* If authenticated / not authenticated, always access to these pages */
        if ([...common_no_restricted_pages].includes(request.nextUrl.pathname)) {
            console.log("middleware - not authenticated - common_no_restricted_pages");

            if (request.nextUrl.pathname === "/company/internal-matters") {
                console.log("middleware - not authenticated - common_no_restricted_pages " + request.nextUrl.pathname + " redirected to parent url");
                return NextResponse.redirect(new URL("/company", request.url));
            }

            console.log("middleware - not authenticated - common_no_restricted_pages - default");
            return NextResponse.next();
        }

        /* If not authenticated, prevent access to these pages */
        if ([...not_authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            console.log("middleware - not authenticated - not_authenticated_restricted_pages");
            return NextResponse.redirect(new URL('/signin', request.url));
        }

        /* If not authenticated, allow access to these pages */
        if ([...authenticated_restricted_pages].includes(request.nextUrl.pathname)) {
            console.log("middleware  - not authenticated - authenticated_restricted_pages");
            return NextResponse.next();
        }

        /* Redirect the request to siginin */
        console.log('middleware - not authenticated - default');
        return NextResponse.redirect(new URL('/siginin', request.url));
    }
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
        '/',
        '/privacy-policy/:path*',
        '/terms-and-conditions/:path*',
        '/company/:path*',
        '/company/internal-matters',
        '/home/:path*'
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