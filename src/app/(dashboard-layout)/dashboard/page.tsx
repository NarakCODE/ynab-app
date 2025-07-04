'use client';

import React from 'react';

import { useAuth, useUser } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';

// No longer need to import or use withAuth
// import withAuth from '@/components/hoc/withAuth';

function DashboardPage() {
	const { signOut } = useAuth();
	const userProfile = useUser();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
			{userProfile ? (
				<p className="mt-2">
					Your currency is set to: <strong>{userProfile.currency}</strong>
				</p>
			) : (
				<p className="mt-2">Loading profile...</p>
			)}
			<Button onClick={signOut}>Sign Out</Button>
		</div>
	);
}

// The page is now exported directly
export default DashboardPage;
