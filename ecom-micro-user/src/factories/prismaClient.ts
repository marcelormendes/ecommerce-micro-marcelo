import { PrismaClient } from "@prisma/client";

export class prismaClient { 
    public static buildPrismaClient() { 
        return new PrismaClient();
    }
}