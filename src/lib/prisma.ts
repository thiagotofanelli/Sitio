import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  // Na Vercel (Serverless), o sistema de arquivos em /var/task é read-only.
  // O único diretório com permissão de leitura e escrita para o SQLite é /tmp.
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = '/tmp/dev.db';
    try {
      if (!fs.existsSync(tmpDbPath)) {
        const potentialSources = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'dev.db'),
        ];
        for (const src of potentialSources) {
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, tmpDbPath);
            break;
          }
        }
      }
    } catch (err) {
      console.warn('Could not copy db to /tmp, will initialize at /tmp/dev.db:', err);
    }
    const url = 'file:/tmp/dev.db';
    process.env.DATABASE_URL = url;
    return url;
  }

  const localUrl = process.env.DATABASE_URL || 'file:./dev.db';
  process.env.DATABASE_URL = localUrl;
  return localUrl;
}

const activeDbUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
