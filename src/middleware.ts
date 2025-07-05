import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const pathname = req.nextUrl.pathname;

	// Skip middleware for auth callback and public routes
	if (
		pathname.startsWith('/auth/callback') ||
		pathname.startsWith('/signin') ||
		pathname.startsWith('/api/auth') ||
		pathname.startsWith('/_next') ||
		pathname.startsWith('/static')
	) {
		return res;
	}

	const supabase = createMiddlewareClient({ req, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Redirect to signin if not authenticated and trying to access protected routes
	if (!session && pathname.startsWith('/dashboard')) {
		return NextResponse.redirect(new URL('/signin', req.url));
	}

	return res;
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
