'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AuthCallback() {
	const router = useRouter();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				// Handle the auth callback from URL hash
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					console.error('Auth callback error:', error);
					router.push('/signin?error=auth_error');
					return;
				}

				if (data.session) {
					// Successfully authenticated
					console.log('Authentication successful:', data.session.user);

					// Redirect to dashboard
					router.replace('/dashboard');
				} else {
					// Try to get session from URL if not already set
					const hashParams = new URLSearchParams(window.location.hash.substring(1));
					const accessToken = hashParams.get('access_token');

					if (accessToken) {
						// Set the session using the tokens from URL
						const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
							access_token: accessToken,
							refresh_token: hashParams.get('refresh_token') || '',
						});

						if (sessionError) {
							console.error('Session setting error:', sessionError);
							router.push('/signin?error=session_error');
							return;
						}

						if (sessionData.session) {
							console.log('Session set successfully:', sessionData.session.user);
							router.replace('/dashboard');
						} else {
							router.push('/signin?error=no_session');
						}
					} else {
						router.push('/signin?error=no_token');
					}
				}
			} catch (error) {
				console.error('Callback handling error:', error);
				router.push('/signin?error=callback_error');
			}
		};

		handleAuthCallback();
	}, [router]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p className="mt-4 text-gray-600">Signing you in...</p>
			</div>
		</div>
	);
}
