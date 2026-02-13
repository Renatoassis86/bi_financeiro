import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Simple check for simulation. In production, use Supabase tokens.
    const authCookie = request.cookies.get('cv_finance_user_mock');
    const { pathname } = request.nextUrl;

    // Protect all routes except login and public assets
    if (!authCookie && pathname !== '/login' && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if logged in and trying to access login page
    if (authCookie && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
