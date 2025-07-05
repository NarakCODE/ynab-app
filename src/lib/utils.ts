import url from '@/constants/url';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getRedirectUrl = () => {
	const isProduction = process.env.NODE_ENV === 'production';
	const protocol = isProduction ? 'https:' : 'http:';
	const baseUrl = url.app.overview;
	const dashboardPath = '/dashboard';

	const finalUrl = protocol + baseUrl + dashboardPath;

	// ADD THIS LINE to see what is being created
	console.log('1. Generated Redirect URL:', finalUrl);

	return finalUrl;
};
