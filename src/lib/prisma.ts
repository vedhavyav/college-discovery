import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrisma = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

let prismaInstance: PrismaClient | undefined;

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (prop === '$$typeof') return undefined; // support React Server Components checking
    if (!prismaInstance) {
      prismaInstance = globalForPrisma.prisma ?? getPrisma();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
      }
    }
    return Reflect.get(prismaInstance, prop, receiver);
  }
});
