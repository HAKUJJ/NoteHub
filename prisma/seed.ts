import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { subjects, gradeLevels, notes, favoriteNoteIds } from './mock-data.js'

// Create a dedicated test user through Supabase Auth/Dashboard first.
const userId = process.env.SEED_USER_ID
if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
  throw new Error('Set SEED_USER_ID to a dedicated Supabase Auth test user UUID.')
}
if (process.env.SEED_CONFIRM_PROJECT !== 'jrpjqgmuigjdgqjkxwrd') {
  throw new Error('Verify DATABASE_URL targets Note-hub, then set SEED_CONFIRM_PROJECT=jrpjqgmuigjdgqjkxwrd.')
}
const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('Set DATABASE_URL to the approved database connection.')
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
try {
  await prisma.$transaction(async (tx) => {
    const users = await tx.$queryRaw<{ id: string }[]>`
      SELECT id FROM auth.users WHERE id = ${userId}::uuid
    `
    if (users.length !== 1) throw new Error('Missing Auth user: create a dedicated test user in the Dashboard first.')
    await tx.profile.upsert({
      where: { id: userId }, update: {},
      create: { id: userId, displayName: 'NotesHub Week 12 Test User' },
    })
    for (const subject of subjects) {
      const existing = await tx.subject.findUnique({ where: { code: subject.code } })
      if (existing && existing.name !== subject.name) throw new Error('Subject code conflicts with existing data.')
      await tx.subject.upsert({ where: { code: subject.code }, update: {}, create: subject })
    }
    for (const grade of gradeLevels) {
      const existing = await tx.gradeLevel.findUnique({ where: { code: grade.code } })
      if (existing && (existing.name !== grade.name || existing.sortOrder !== grade.sortOrder)) {
        throw new Error('Grade code conflicts with existing data.')
      }
      await tx.gradeLevel.upsert({ where: { code: grade.code }, update: {}, create: grade })
    }
    for (const note of notes) {
      const existing = await tx.note.findUnique({ where: { id: note.id } })
      if (existing && (existing.authorId !== userId || existing.title !== note.title
          || existing.description !== note.description || existing.type !== note.type
          || existing.subjectCode !== note.subjectCode || existing.gradeCode !== note.gradeCode)) {
        throw new Error('Mock note UUID conflicts with existing data; refusing to overwrite it.')
      }
      await tx.note.upsert({ where: { id: note.id }, update: {}, create: { ...note, authorId: userId } })
    }
    for (const noteId of favoriteNoteIds) {
      await tx.favorite.upsert({
        where: { userId_noteId: { userId, noteId } }, update: {},
        create: { userId, noteId },
      })
    }
  }, { timeout: 30_000 })
  console.log('Seed complete: 5 subjects, 6 grades, 10 mock notes, 4 favorites; existing rows preserved.')
} finally {
  await prisma.$disconnect()
}
