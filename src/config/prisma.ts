// prismaSingleton.ts

import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

class PrismaSingleton {
  private readonly prisma: PrismaClient;

  private static instance: PrismaSingleton | null = null;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): PrismaSingleton {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton();
    }
    return PrismaSingleton.instance;
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public async checkDbConnection() {
    try {
      logger.info("Connecting to database...");
      await this.prisma.$connect();
      logger.info("Database connection established successfully.");
    } catch (error) {
      logger.error("Failed to connect to the database:", error);
      process.exit(1);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

const prismaInstance = PrismaSingleton.getInstance();
prismaInstance.checkDbConnection();

export default prismaInstance.getPrisma();
