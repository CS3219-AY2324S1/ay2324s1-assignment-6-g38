import { PrismaClient } from "@prisma/client";

let prismaClientInstance: PrismaClient | undefined;

export function getPrismaClient() {
  if (!prismaClientInstance) {
    prismaClientInstance = new PrismaClient();
  }
  return prismaClientInstance!;
}
