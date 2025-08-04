import { PrismaClient } from "@prisma/client";
import { env } from "../../config/index.js";
import { logger } from "../logger/index.js";

let prisma; // lazily initialized

/**
 * Returns a singleton instance of PrismaClient.
 * Automatically configures query logging based on NODE_ENV.
 * Ensures that only one PrismaClient instance is used across the app.
 */
export function getClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
      datasources: { db: { url: env.DATABASE_URL } },
    });
  }

  return prisma;
}

export async function disconnect() {
  if (prisma) await prisma.$disconnect();
}

export async function healthCheck() {
  try {
    await getClient().$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    logger.error({ err }, "DB health check failed");
    return false;
  }
}
