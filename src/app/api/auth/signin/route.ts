import { NextRequest, NextResponse } from 'next/server';

import messages, { emails } from '@/constants/messages';
import { SignInEmail } from '@/emails/signin';
import WelcomeEmail from '@/emails/welcome';
import { Database } from '@/lib/database.types';
import resend from '@/lib/email';
import prisma from '@/lib/prisma';
import { getRedirectUrl } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
	process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
	{ auth: { persistSession: false } }
);

type UserData = {
	email: string;
	id: string;
	new_signup_email: boolean;
};

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ message: 'Email is required' }, { status: 400 });
		}

		const redirectToUrl = getRedirectUrl();
		console.log('Redirect URL for magic link:', redirectToUrl);

		const user = (await prisma.users.findFirst({
			where: { email },
			select: { email: true, id: true, new_signup_email: true },
		})) as UserData;

		if (!user || !user.id) {
			return NextResponse.json({ message: messages.account.doesntexist }, { status: 404 });
		}

		// Generate magic link with proper options
		const { data, error } = await supabaseAdmin.auth.admin.generateLink({
			type: 'magiclink',
			email,
			options: {
				redirectTo: redirectToUrl,
				// Add additional options for better reliability
				data: {
					user_id: user.id,
					timestamp: new Date().toISOString(),
				},
			},
		});

		if (error) {
			console.error('Supabase magic link error:', error);
			throw new Error(`Failed to generate magic link: ${error.message}`);
		}

		const { properties } = data;
		const { action_link } = properties;

		if (!action_link) {
			throw new Error('No action link generated');
		}

		try {
			// Send welcome email for new users
			if (!user.new_signup_email) {
				await resend.emails.send({
					from: emails.from,
					subject: emails.welcome.subject,
					to: user.email,
					react: WelcomeEmail(),
				});

				await prisma.users.update({
					where: { id: user.id },
					data: { new_signup_email: true },
				});
			}

			// Send signin email
			await resend.emails.send({
				from: emails.from,
				subject: emails.signin.subject,
				to: email,
				react: SignInEmail({ action_link }),
			});

			return NextResponse.json({
				message: emails.sent,
				success: true,
			});
		} catch (emailError: any) {
			console.error('Email sending error:', emailError);
			throw new Error(`Failed to send email: ${emailError.message}`);
		}
	} catch (error: any) {
		console.error('Signin API error:', error);
		return NextResponse.json(
			{
				message: error.message || messages.error,
				success: false,
			},
			{ status: 500 }
		);
	}
}
