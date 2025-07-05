import url from '@/constants/url';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getRedirectUrl = () => {
	const isProduction = process.env.NODE_ENV === 'production';
	// For production, use the app subdomain. For local, use localhost.
	const host = 'localhost:3000';
	// Use the auth callback route instead of directly to dashboard
	const finalUrl = `http://${host}/auth/callback`;

	console.log('Generated Redirect URL for Supabase:', finalUrl);

	return finalUrl;
};
