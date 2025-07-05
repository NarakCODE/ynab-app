import * as React from 'react';

import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

import Footer from './footer';
import Footnote from './footnote';

const baseUrl = 'https://expense.fyi';

export const SignInEmail = ({ action_link = '' }: { action_link?: string }) => {
	// Clean up the action link for display
	const displayLink = action_link.replace(/^https?:\/\//, '');

	return (
		<Html>
			<Tailwind>
				<Head />
				<Preview>Sign in link to Expense.fyi</Preview>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
						<Section className="mt-[22px]">
							<Img src={`${baseUrl}/icons/logo.png`} width="50" height="50" alt="Logo" className="block m-auto" />
						</Section>
						<Heading className="text-black text-[24px] font-normal text-center p-0 mb-[24px] mt-[12px] mx-0">
							Magic Link
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">Hello,</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							Please click the link below to sign in to your account. This link will expire in 10 minutes.
						</Text>
						<Section className="text-center my-[24px]">
							<Link
								className="bg-[#000000] p-3 px-6 rounded-md text-white text-[14px] font-medium no-underline inline-block"
								href={action_link}
							>
								Sign in to Dashboard
							</Link>
						</Section>
						<Text className="text-black text-[14px] mt-[16px] mb-[10px] leading-[24px]">
							Or copy and paste this URL into your browser:
						</Text>
						<Section className="bg-gray-50 p-3 rounded border my-[16px]">
							<Text className="text-[12px] font-mono text-gray-700 break-all leading-[18px] margin-0">
								{displayLink}
							</Text>
						</Section>
						<Text className="text-gray-500 text-[12px] leading-[20px]">
							If you didn't request this sign-in link, you can safely ignore this email.
						</Text>
						<Footnote hideNote={true} />
						<Footer />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
