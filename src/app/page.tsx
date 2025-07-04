import prisma from '@/lib/prisma';

export default async function Home() {
  const users = await prisma.users.findMany();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}