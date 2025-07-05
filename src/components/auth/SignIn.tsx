import { Auth, AuthDescription, AuthForm, AuthHeader, AuthTitle } from './AuthLayout';
import { SignInForm } from './SignInForm';

export function SignIn() {
	return (
		<Auth imgSrc="/images/illustrations/misc/welcome.svg">
			<AuthHeader>
				<AuthTitle>Welcome back!</AuthTitle>
				<AuthDescription>Use your email address to securely sign in.</AuthDescription>
			</AuthHeader>
			<AuthForm>
				<SignInForm />
			</AuthForm>
		</Auth>
	);
}
