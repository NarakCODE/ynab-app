'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@supabase/supabase-js';

import { Auth, AuthDescription, AuthForm, AuthHeader, AuthTitle } from './AuthLayout';
import { SignInForm } from './SignInForm';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function SignIn() {
	const router = useRouter();
	const { session, isLoading } = useAuth();
	const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);

	// If user is already authenticated, redirect to dashboard
	useEffect(() => {
		if (!isLoading && session) {
			console.log('User already authenticated, redirecting to dashboard');
			router.replace('/dashboard');
		}
	}, [session, isLoading, router]);

	useEffect(() => {
		const handleMagicLinkCallback = async () => {
			// Check if we have auth tokens in the URL hash (magic link callback)
			const hashParams = new URLSearchParams(window.location.hash.substring(1));
			const accessToken = hashParams.get('access_token');
			const refreshToken = hashParams.get('refresh_token');
			const type = hashParams.get('type');

			if (accessToken && refreshToken && type === 'magiclink') {
				setIsProcessingMagicLink(true);

				try {
					console.log('Processing magic link authentication...');

					const { data, error } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken,
					});

					if (error) {
						console.error('Magic link session error:', error);
						window.location.hash = '';
						setIsProcessingMagicLink(false);
						return;
					}

					if (data.session) {
						console.log('Magic link auth successful:', data.session.user);
						// Clear the hash to clean up URL
						window.location.hash = '';
						// The AuthProvider will handle the redirect via onAuthStateChange
						// But we can also trigger it manually to be sure
						setTimeout(() => {
							router.replace('/dashboard');
						}, 500);
					} else {
						console.error('No session created from magic link');
						window.location.hash = '';
						setIsProcessingMagicLink(false);
					}
				} catch (error) {
					console.error('Magic link callback error:', error);
					window.location.hash = '';
					setIsProcessingMagicLink(false);
				}
			}
		};

		// Small delay to ensure the component is mounted
		const timer = setTimeout(() => {
			handleMagicLinkCallback();
		}, 100);

		return () => clearTimeout(timer);
	}, [router]);

	// Show loading state while processing magic link
	if (isProcessingMagicLink) {
		return (
			<Auth imgSrc="/images/illustrations/misc/welcome.svg">
				<AuthHeader>
					<AuthTitle>Signing you in...</AuthTitle>
					<AuthDescription>Processing your magic link authentication.</AuthDescription>
				</AuthHeader>
				<AuthForm>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-4 text-gray-600">Please wait...</p>
						</div>
					</div>
				</AuthForm>
			</Auth>
		);
	}

	// Show loading state while checking existing session
	if (isLoading) {
		return (
			<Auth imgSrc="/images/illustrations/misc/welcome.svg">
				<AuthHeader>
					<AuthTitle>Welcome back!</AuthTitle>
					<AuthDescription>Checking your authentication status...</AuthDescription>
				</AuthHeader>
				<AuthForm>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-4 text-gray-600">Loading...</p>
						</div>
					</div>
				</AuthForm>
			</Auth>
		);
	}

	// Don't render the signin form if user is already authenticated
	if (session) {
		return null;
	}

	return (
		<Auth imgSrc="/images/illustrations/misc/welcome.svg">
			<AuthHeader>
				<AuthTitle>Welcome back!</AuthTitle>
				<AuthDescription>Use your email address to securely sign in.</AuthDescription>
			</AuthHeader>
			<AuthForm>
				<SignInForm />
			</AuthForm>
		</Auth>
	);
}
