// prisma.config.ts
import { PrismaClientOptions } from '@prisma/client/runtime/library';

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
} satisfies PrismaClientOptions;
