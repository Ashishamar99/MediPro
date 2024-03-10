// prismaSingleton.ts

import { PrismaClient } from '@prisma/client'

class PrismaSingleton {
  private readonly prisma: PrismaClient

  private static instance: PrismaSingleton | null = null

  private constructor () {
    this.prisma = new PrismaClient()
  }

  public static getInstance (): PrismaSingleton {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton()
    }
    return PrismaSingleton.instance
  }

  public getPrisma (): PrismaClient {
    return this.prisma
  }
}

const prismaInstance = PrismaSingleton.getInstance()

export default prismaInstance.getPrisma()
