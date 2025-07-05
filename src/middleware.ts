import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import urls from '@/constants/url';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const hostname = req.headers.get('host');
	const url = req.nextUrl;

	const currentHost = hostname?.replace(`.${urls.homeWithoutApp}`, '');
	const supabase = createMiddlewareClient({ req, res });
	const { data } = await supabase.auth.getSession();
	const { session } = data;

	// Only run logic if on "app" subdomain
	if (currentHost === 'app') {
		const pathname = url.pathname;

		const isAuthRoute = ['/signin', '/signup'].includes(pathname);
		const isProtectedRoute = pathname.startsWith('/dashboard');

		if (isAuthRoute) {
			if (session) {
				// Authenticated user trying to access auth page — redirect to home
				url.pathname = '/dashboard';
				return NextResponse.redirect(url);
			}
			// Allow access to sign-in/up
			return res;
		}

		if (isProtectedRoute && !session) {
			// Unauthenticated user accessing protected route — redirect to sign-in
			url.pathname = '/signin';
			return NextResponse.redirect(url);
		}
	}

	return res;
}

export const config = {
	matcher: ['/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)'],
};
