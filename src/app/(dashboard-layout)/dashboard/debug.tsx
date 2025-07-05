'use client';

import React from 'react';

import { useAuth, useUser } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function DebugDashboard() {
	const { session, isLoading, signOut } = useAuth();
	const userProfile = useUser();
	const [debugInfo, setDebugInfo] = React.useState<any>(null);

	React.useEffect(() => {
		const getDebugInfo = async () => {
			try {
				// Get session from Supabase directly
				const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

				// Get user from Supabase directly
				const { data: userData, error: userError } = await supabase.auth.getUser();

				setDebugInfo({
					contextSession: session,
					contextIsLoading: isLoading,
					contextUserProfile: userProfile,
					supabaseSession: sessionData.session,
					supabaseSessionError: sessionError,
					supabaseUser: userData.user,
					supabaseUserError: userError,
					timestamp: new Date().toISOString(),
					currentUrl: window.location.href,
					localStorage: {
						supabaseAuthToken: localStorage.getItem('supabase.auth.token'),
						// Check for any auth-related items
						allKeys: Object.keys(localStorage).filter((key) => key.includes('supabase')),
					},
				});
			} catch (error) {
				console.error('Debug info error:', error);
				setDebugInfo({ error: error instanceof Error ? error.message : String(error) });
			}
		};

		getDebugInfo();
	}, [session, isLoading, userProfile]);

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Debug Dashboard (No Auth Guard)</h1>

			<div className="space-y-6">
				{/* Quick Status */}
				<div className="bg-gray-100 p-4 rounded-lg">
					<h2 className="text-lg font-semibold mb-2">Quick Status</h2>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<strong>Auth Context Loading:</strong> {isLoading ? 'YES' : 'NO'}
						</div>
						<div>
							<strong>Auth Context Session:</strong> {session ? 'EXISTS' : 'NULL'}
						</div>
						<div>
							<strong>User Profile:</strong> {userProfile ? 'EXISTS' : 'NULL'}
						</div>
						<div>
							<strong>User Email:</strong> {session?.user?.email || 'N/A'}
						</div>
					</div>
				</div>

				{/* Detailed Debug Info */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold mb-2">Detailed Debug Info</h2>
					<pre className="text-xs overflow-auto bg-white p-3 rounded border max-h-96">
						{JSON.stringify(debugInfo, null, 2)}
					</pre>
				</div>

				{/* Actions */}
				<div className="flex gap-4">
					<Button onClick={signOut} variant="outline">
						Sign Out
					</Button>
					<Button onClick={() => window.location.reload()} variant="outline">
						Reload Page
					</Button>
					<Button onClick={() => (window.location.href = '/dashboard')} variant="default">
						Go to Protected Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
