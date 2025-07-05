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

	// If user is already authenticated, redirect to dashboard
	useEffect(() => {
		if (!isLoading && session) {
			console.log('User already authenticated, redirecting to dashboard');
			router.replace('/dashboard');
		}
	}, [session, isLoading, router]);



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
