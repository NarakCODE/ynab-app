'use client';

import { useRouter } from 'next/navigation';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

// Define a type for your user profile data for better type safety
interface UserProfile {
	currency: string;
	locale: string;
	// Add other profile fields you need from your `users` table
}

// Define the shape of your context
interface AuthContextType {
	session: Session | null;
	profile: UserProfile | null;
	isLoading: boolean;
	signOut: () => Promise<void>;
}

// Create a strongly-typed context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The main provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const supabase = createClientComponentClient();
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch the user's profile from your `users` table using TanStack Query
	const { data: profile } = useQuery({
		// The query key includes the user's ID, so it refetches if the user changes
		queryKey: ['user-profile', session?.user.id],
		queryFn: async () => {
			if (!session) return null;

			// Fetch the profile from the `users` table (assuming your table is named 'users')
			const { data, error } = await supabase.from('users').select('*').eq('id', session.user.id).single();

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		// The query will only run if there is an active session
		enabled: !!session,
	});

	useEffect(() => {
		// Immediately check for an active session when the provider mounts
		const getInitialSession = async () => {
			const { data } = await supabase.auth.getSession();
			setSession(data.session);
			setIsLoading(false);
		};

		getInitialSession();

		// Set up a listener for authentication state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, currentSession) => {
			setSession(currentSession);
			// Optional: you can refresh the page on sign-in to reload server components
			if (_event === 'SIGNED_IN') {
				router.refresh();
			}
		});

		// Cleanup the subscription when the component unmounts
		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase, router]);

	const signOut = async () => {
		await supabase.auth.signOut();
		// Redirect to sign-in page after signing out
		router.push('/signin');
	};

	// Memoize the context value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({
			session,
			profile: profile || null,
			isLoading,
			signOut,
		}),
		[session, profile, isLoading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider.');
	}
	return context;
};

// Optional: A convenience hook just for the user profile
export const useUser = () => {
	const { profile } = useAuth();
	return profile;
};
