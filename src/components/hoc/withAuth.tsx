'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useAuth } from '../providers/AuthProvider';

// This is a Higher-Order Component that protects pages from unauthenticated access
export default function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
	const WithAuthComponent = (props: P) => {
		const { session, isLoading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			// If loading is finished and there's no active session, redirect to the sign-in page
			if (!isLoading && !session) {
				router.replace('/signin');
			}
		}, [isLoading, session, router]);

		// While loading, you can show a spinner or return null
		if (isLoading || !session) {
			return <div>Loading...</div>; // Or a nice loading spinner component
		}

		// If authenticated, render the wrapped component
		return <WrappedComponent {...props} />;
	};

	return WithAuthComponent;
}
