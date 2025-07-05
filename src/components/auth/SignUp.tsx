import { Auth, AuthDescription, AuthForm, AuthHeader, AuthTitle } from '@/components/auth/AuthLayout';
import SignUpForm from '@/components/auth/SignUpForm';

export function SignUp() {
	return (
		<Auth imgSrc="/images/illustrations/misc/welcome.svg">
			<AuthHeader>
				<AuthTitle>Sign Up</AuthTitle>
				<AuthDescription>Enter your information to create an account</AuthDescription>
			</AuthHeader>
			<AuthForm>
				<SignUpForm />
			</AuthForm>
		</Auth>
	);
}
