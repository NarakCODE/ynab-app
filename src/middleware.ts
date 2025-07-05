import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

import url from './constants/url';

console.log(url.homeWithoutApp);

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const hostname = req.headers.get('host');
	const url = req.nextUrl;

	const currentHost = hostname?.replace(`localhost:3000`, '');

	const supabase = createMiddlewareClient({ req, res });
	const { data } = await supabase.auth.getSession();
	const { session } = data;

	console.log(data);

	if (url.pathname.startsWith('/dashboard') && !session) {
		url.pathname = '/signin';
		return NextResponse.redirect(url);
	}

	return res;
}

export const config = {
	matcher: ['/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)'],
};
