import { Metadata } from 'next';

import React from 'react';

import { SignIn } from '@/components/auth/SignIn';

export const metadata: Metadata = {
	title: 'Sign In',
};

export default function SignInPage() {
	return <SignIn />;
}
