const messages = {
	success: 'Successfully added!',
	updated: 'Successfully updated!',
	deleted: 'Successfully deleted!',
	loading: 'Loading...',
	error: 'Error occurred, please try again.',
	serverError: 'Internal Server Error',
	paymentSuccess: 'Your payment is successful, page will reload in 6 seconds.',
	paymentCancelled: 'Payment is cancelled, please try again',
	premiumUpgrade: 'Upgrade for access to premium features.',
	request: {
		failed: 'Failed to get the data',
		invalid: 'Invalid request',
	},
	account: {
		doesntexist: 'No such account, Sign up instead.',
		exist: 'This account already exists, Sign in instead.',
		unauthorized: 'Unauthorized request',
	},
	export: 'Export will begin shortly.',
	payments: {
		success: 'Your payment is successful, page will reload in 6 seconds.',
		dismissed: 'Payment is cancelled, please try again',
	},
};

export const emails = {
	email: 'Acme <onboarding@resend.dev>',
	feedback: {
		subject: '🎉 New Feedback Received',
		sent: 'Feedback received.',
		failed: 'Failed to send, please try again.',
	},
	account: {
		deleted: 'Your Expense.fyi account is Deleted!',
	},
	welcome: {
		subject: '✨ Welcome to Expense.fyi',
	},
	usageLimit: {
		premiumExpired: {
			subject: 'Your Premium Plan Expired!',
			message: 'Your premium plan limit is reached, renew again to continue.',
		},
		premium: {
			subject: 'Your Premium Plan usage exceeded!',
			message: 'Your premium plan limit is reached, renew to continue.',
		},
		basic: {
			subject: 'Your Basic Plan usage exceeded!',
			message: 'Your basic plan limit is reached, upgrade to premium plan.',
		},
	},
	sent: 'We just sent an email with magic link, check your inbox.',
	from: 'Gokul from Acme <onboarding@resend.dev>',
	signin: { subject: 'Sign in link for Acme.fyi' },
	signup: { subject: 'Sign up link for Acme.fyi' },
};

export default messages;
