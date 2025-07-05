import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AuthProvider } from '@/components/providers/AuthProvider';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'sonner';

import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const supabaseOption = {
	supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
};

export const metadata: Metadata = {
	title: {
		template: '%s | YNAB',
		default: 'YNAB',
	},
	description:
		'YNAB is a personal budgeting app that helps you take control of your money and achieve your financial goals.',
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
};

export const revalidate = 0; //	In seconds

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<AuthProvider>{children}</AuthProvider>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
