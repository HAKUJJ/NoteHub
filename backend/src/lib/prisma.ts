import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from '../config/env.js'

export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: config.databaseUrl, connectionTimeoutMillis: 5000, max: 5 }) })
