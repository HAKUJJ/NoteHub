import { app } from './app.js'
import { config } from './config/env.js'
import { prisma } from './lib/prisma.js'

const server=app.listen(config.port,()=>console.log(`NotesHub API: http://localhost:${config.port}/api`))
async function shutdown(){server.close();await prisma.$disconnect()}
process.on('SIGINT',shutdown)
process.on('SIGTERM',shutdown)
