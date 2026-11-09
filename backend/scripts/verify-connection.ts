import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { readdirSync } from 'node:fs'

// Only emit fixed messages/counters: raw Prisma/CLI errors can contain credentials.
const results: Record<string, unknown> = {}
for (const variable of ['DATABASE_URL','DIRECT_URL']) {
  const usingDatabaseUrl = variable === 'DIRECT_URL' && !process.env.DIRECT_URL
  const connectionString = process.env[variable] || (usingDatabaseUrl ? process.env.DATABASE_URL : undefined)
  let client: PrismaClient | undefined
  try {
    if (!connectionString) { results[variable] = { connected:false,error:'ENV_MISSING' }; continue }
    const placeholder = /YOUR[-_]|%5BYOUR/i.test(connectionString)
    client = new PrismaClient({adapter:new PrismaPg({connectionString,connectionTimeoutMillis:5000,max:1})})
    await client.$queryRaw`SELECT 1`
    const notes = await client.note.findMany({take:3,select:{id:true,title:true,description:true}})
    results[variable] = {connected:true,placeholder,notesRead:notes.length,...(usingDatabaseUrl ? {usingDatabaseUrl:true} : {})}
    if(variable === 'DIRECT_URL') {
      const [{history}] = await client.$queryRaw<{history:string|null}[]>`SELECT to_regclass('public._prisma_migrations')::text AS history`
      const columns = await client.$queryRaw<{column_name:string}[]>`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='notes'`
      const [{books}] = await client.$queryRaw<{books:string|null}[]>`SELECT to_regclass('public.book_favorites')::text AS books`
      const missingNoteColumns = ['content','subject_name','updated_at','attachment','status'].filter(name=>!columns.some(c=>c.column_name===name))
      results.schema = {missingNoteColumns,bookFavoritesTableExists:!!books,ready:missingNoteColumns.length===0 && !!books}
      if(!history) results.migrationHistory = {exists:false,baseliningRequired:true,localMigrations:readdirSync('prisma/migrations',{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name)}
      else {
        const applied = await client.$queryRaw<{migration_name:string;finished_at:Date|null;rolled_back_at:Date|null}[]>`SELECT migration_name,finished_at,rolled_back_at FROM public._prisma_migrations`
        const local = readdirSync('prisma/migrations',{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name)
        results.migrationHistory = {exists:true,pending:local.filter(name=>!applied.some(m=>m.migration_name===name && m.finished_at && !m.rolled_back_at)),failed:applied.filter(m=>!m.finished_at && !m.rolled_back_at).map(m=>m.migration_name)}
      }
    }
  } catch (error) {
    const internalMessage = error instanceof Error ? error.message : ''
    results[variable] = {
      connected:false,
      error: /YOUR[-_]|%5BYOUR/i.test(connectionString ?? '') ? 'DATABASE_PASSWORD_PLACEHOLDER' : /timeout|timed out/i.test(internalMessage) ? 'DATABASE_CONNECTION_TIMEOUT' : 'DATABASE_CONNECTION_FAILED',
      message:'Prisma connection/read failed. Raw driver error suppressed to protect credentials.',
    }
  } finally { await client?.$disconnect() }
}
if ((results.DIRECT_URL as {connected?:boolean})?.connected) {
  const require = createRequire(import.meta.url)
  const status = spawnSync(process.execPath,[require.resolve('prisma/build/index.js'),'migrate','status'],{encoding:'utf8',timeout:20000})
  // Capture output privately; never echo connection information printed by Prisma CLI.
  const output = `${status.stdout ?? ''}\n${status.stderr ?? ''}`
  results.migrations = {exitCode:status.status,
    error:status.error ? 'CLI_EXECUTION_FAILED' : /Schema engine error/i.test(output) ? 'SCHEMA_ENGINE_ERROR' : status.status !== 0 ? 'MIGRATION_STATUS_NOT_CLEAN' : undefined,
    upToDate:/Database schema is up to date/i.test(output),
    pending:/not yet been applied|have not yet been applied/i.test(output),
    baseliningRequired:(results.migrationHistory as {baseliningRequired?:boolean}|undefined)?.baseliningRequired ?? /not managed by Prisma Migrate|not managed with Prisma Migrate/i.test(output),
    rawOutputSuppressed:true}
} else results.migrations = {status:'BLOCKED_DATABASE_CONNECTION',applied:false}
console.log(JSON.stringify(results,null,2))
if (Object.values(results).some(r => (r as {connected?:boolean}).connected === false) || (results.migrations as {exitCode?:number}).exitCode !== 0 || (results.schema as {ready?:boolean}|undefined)?.ready === false) process.exitCode=1
