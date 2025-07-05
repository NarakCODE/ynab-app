import url from '@/constants/url';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getRedirectUrl = () => {
	const isProduction = process.env.NODE_ENV === 'production';

	const baseUrl =
		process.env.NEXT_PUBLIC_SITE_URL || (isProduction ? 'https://expense.fyi' : 'http://app.localhost:3000');

	// Ensure baseUrl doesn't end with a slash
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');

	// Construct the callback URL for auth
	const callbackUrl = `${cleanBaseUrl}/auth/callback`;

	console.log('Generated Redirect URL:', callbackUrl);

	return callbackUrl;
};
