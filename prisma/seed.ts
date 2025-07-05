import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Make sure to install dotenv: npm install dotenv

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Supabase Admin Client
// Ensure your .env file has these variables
const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL || '',
	process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function main() {
	console.log('Seeding...');

	// 1. Delete all existing auth users to start clean
	const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
	if (listError) {
		console.error('Error listing users:', listError);
		return;
	}
	for (const user of usersList.users) {
		await supabaseAdmin.auth.admin.deleteUser(user.id);
	}
	console.log('Cleared existing auth users.');

	// 2. Create 10 new users in Supabase Auth and get their IDs
	for (let i = 0; i < 10; i++) {
		const email = faker.internet.email();
		const password = 'password123'; // Use a temporary password

		// Create the user in Supabase Auth
		const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
			email,
			password,
			email_confirm: true, // Auto-confirm the email for seeding
		});

		if (authError) {
			console.error(`Error creating auth user ${email}:`, authError.message);
			continue; // Skip this user if creation fails
		}

		if (authData.user) {
			console.log(`Created auth user: ${authData.user.email}`);
			const newUserId = authData.user.id;

			// The trigger we created earlier will automatically create the user in `public.users`.
			// We just need to add the other data.
			// Let's wait a moment to ensure the trigger has fired.
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Update the user profile with extra details
			await prisma.users.update({
				where: { id: newUserId },
				data: {
					currency: faker.finance.currencyCode(),
					locale: faker.location.countryCode(),
				},
			});

			// Now create related data for this user
			console.log(`Seeding data for user ${newUserId}...`);

			// Create 5 expenses
			await prisma.expenses.createMany({
				data: Array.from({ length: 5 }).map(() => ({
					name: faker.commerce.productName(),
					price: faker.commerce.price(),
					category: faker.commerce.department(),
					date: faker.date.past().toISOString(),
					user_id: newUserId,
				})),
			});

			// Create 3 income records
			await prisma.income.createMany({
				data: Array.from({ length: 3 }).map(() => ({
					name: faker.company.name(),
					price: faker.finance.amount({ min: 1000, max: 5000, dec: 2 }),
					category: 'Salary',
					date: faker.date.past().toISOString(),
					user_id: newUserId,
				})),
			});
		}
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
