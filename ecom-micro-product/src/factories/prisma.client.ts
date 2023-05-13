import { PrismaClient } from "@prisma/client";

export class PrismaClientSingle {
    public static buildPrismaClient() {
        return new PrismaClient();
    }
}