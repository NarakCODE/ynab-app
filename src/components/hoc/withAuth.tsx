'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useAuth } from '@/components/providers/AuthProvider';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
	const AuthenticatedComponent = (props: P) => {
		const { session, isLoading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			// Wait for loading to complete before making redirect decisions
			if (!isLoading) {
				if (!session) {
					console.log('No session found, redirecting to signin');
					router.push('/signin');
				} else {
					console.log('Session found, user is authenticated');
				}
			}
		}, [session, isLoading, router]);

		// Show loading state while checking authentication
		if (isLoading) {
			return (
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-4 text-gray-600">Loading...</p>
					</div>
				</div>
			);
		}

		// Show loading state while redirecting
		if (!session) {
			return (
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-4 text-gray-600">Redirecting to sign in...</p>
					</div>
				</div>
			);
		}

		// Render the wrapped component if authenticated
		return <WrappedComponent {...props} />;
	};

	AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

	return AuthenticatedComponent;
};

export default withAuth;
