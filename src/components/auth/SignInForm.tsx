'use client';

import Link from 'next/link';

import { ButtonLoading } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email({ message: 'Enter a valid email address.' }),
});
type FormValues = z.infer<typeof schema>;

async function sendMagicLink({ email }: FormValues) {
	const response = await fetch('/api/auth/signin', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email }),
	});

	if (!response.ok) {
		const { message } = await response.json();
		throw new Error(message || 'Unexpected error occurred.');
	}

	return response.json();
}

export function SignInForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: '' },
	});

	const { mutateAsync, isPending, isSuccess } = useMutation({
		mutationKey: ['send-magic-link'],
		mutationFn: sendMagicLink,
		onError: (error: Error) => {
			toast.error('Failed to send magic link', {
				description: error.message,
			});
		},
		onSuccess: () => {
			toast.success('Magic link sent! Check your inbox.');
		},
	});

	const onSubmit = async (data: FormValues) => {
		await mutateAsync(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="you@example.com" disabled={isPending} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ButtonLoading type="submit" isLoading={isPending} disabled={isPending}>
					Send Magic Link
				</ButtonLoading>

				<div className="-mt-4 text-center text-sm">
					Don&apos;t have an account?{' '}
					<Link href={'/signup'} className="underline">
						Sign up
					</Link>{' '}
					for free.
				</div>
			</form>
		</Form>
	);
}
