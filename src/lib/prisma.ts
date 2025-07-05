import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Enhanced singleton pattern for development
let prisma: PrismaClientSingleton;

if (process.env.NODE_ENV === 'production') {
  prisma = prismaClientSingleton();
} else {
  // In development, ensure we only have one instance
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaClientSingleton();
    
    // Handle hot reload cleanup
    if (typeof window === 'undefined') {
      process.on('beforeExit', async () => {
        await globalForPrisma.prisma?.$disconnect();
      });
    }
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
