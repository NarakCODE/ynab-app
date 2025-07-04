
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  const users = [];

  // Create 10 users
  for (let i = 0; i < 10; i++) {
    const user = await prisma.users.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        currency: faker.finance.currencyCode(),
        locale: faker.location.countryCode(),
      },
    });
    users.push(user);
  }

  // Create expenses, income, investments, and subscriptions for each user
  for (const user of users) {
    // Create 5 expenses for each user
    for (let i = 0; i < 5; i++) {
      await prisma.expenses.create({
        data: {
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
          category: faker.commerce.department(),
          date: faker.date.past().toISOString(),
          user_id: user.id,
        },
      });
    }

    // Create 3 income for each user
    for (let i = 0; i < 3; i++) {
      await prisma.income.create({
        data: {
          name: faker.company.name(),
          price: faker.finance.amount({ min: 1000, max: 5000, dec: 2 }),
          category: 'Salary',
          date: faker.date.past().toISOString(),
          user_id: user.id,
        },
      });
    }

    // Create 2 investments for each user
    for (let i = 0; i < 2; i++) {
      await prisma.investments.create({
        data: {
          name: faker.finance.accountName(),
          price: faker.finance.amount({ min: 500, max: 10000, dec: 2 }),
          units: faker.number.int({ min: 1, max: 100 }).toString(),
          category: 'Stocks',
          date: faker.date.past().toISOString(),
          user_id: user.id,
        },
      });
    }

    // Create 1 subscription for each user
    await prisma.subscriptions.create({
      data: {
        name: faker.company.name(),
        price: faker.finance.amount({ min: 5, max: 50, dec: 2 }),
        paid: 'monthly',
        date: faker.date.past().toISOString(),
        user_id: user.id,
        url: faker.internet.url(),
      },
    });
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
