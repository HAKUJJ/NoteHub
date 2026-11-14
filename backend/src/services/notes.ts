import { Prisma } from '@prisma/client'
import type { User } from '@supabase/supabase-js'
import { prisma } from '../lib/prisma.js'
import { assertOwnership } from '../middleware/auth.js'
import { HttpError } from '../middleware/errors.js'
import { integer, noteInput, text } from '../validators/input.js'

export const includeNote = { author: true, subject: true, gradeLevel: true } as const
type FullNote = Prisma.NoteGetPayload<{ include: typeof includeNote }>

export function presentNote(note: FullNote) {
  const attachment = note.attachment as { name: string; type: string; size: number } | null

  return {
    id: note.id,
    title: note.title,
    description: note.description,
    content: note.content,
    subject: note.subjectName || note.subject.name,
    category: note.subjectCode,
    grade: note.gradeCode,
    type: note.type,
    author: note.author.displayName,
    authorId: note.authorId,
    authorAvatar: note.author.avatar,
    status: note.status,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    image: note.image ?? undefined,
    attachment: attachment
      ? { name: attachment.name, type: attachment.type, size: attachment.size }
      : undefined,
  }
}

export async function ensureProfile(user: User) {
  const metadataName = user.user_metadata.display_name
  const name = typeof metadataName === 'string' ? metadataName.trim().slice(0, 100) : ''

  return prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, displayName: name || 'สมาชิก NotesHub' },
  })
}

export async function listNotes(query: Record<string, unknown>) {
  const page = integer(query.page, 1, 100000)
  const limit = integer(query.limit, 12, 100)
  const search = query.search === undefined ? '' : text(query.search, 'คำค้น', 200, true)
  const where: Prisma.NoteWhereInput = {}

  if (search) {
    where.OR = [
      ...['title', 'description', 'content', 'subjectName'].map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      })),
      { subject: { name: { contains: search, mode: 'insensitive' } } },
      { author: { displayName: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (query.subject && query.subject !== 'all') {
    where.subjectCode = text(query.subject, 'วิชา', 20)
  }

  if (query.grade && query.grade !== 'all') {
    let grade = text(query.grade, 'ระดับชั้น', 20)
    if (/^[1-6]$/.test(grade)) grade = `m${grade}`

    if (!['junior', 'senior', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6'].includes(grade)) {
      throw new HttpError(400, 'ระดับชั้นไม่ถูกต้อง')
    }

    where.gradeCode =
      grade === 'junior'
        ? { in: ['m1', 'm2', 'm3'] }
        : grade === 'senior'
          ? { in: ['m4', 'm5', 'm6'] }
          : grade
  }

  if (query.type && query.type !== 'all') {
    if (!['note', 'exam'].includes(String(query.type))) {
      throw new HttpError(400, 'ประเภทไม่ถูกต้อง')
    }
    where.type = String(query.type)
  }

  const sort = query.sort ?? 'newest'
  if (!['newest', 'oldest', 'title'].includes(String(sort))) {
    throw new HttpError(400, 'การเรียงลำดับไม่ถูกต้อง')
  }

  const orderBy: Prisma.NoteOrderByWithRelationInput[] =
    sort === 'title'
      ? [{ title: 'asc' }, { id: 'asc' }]
      : [{ createdAt: sort === 'oldest' ? 'asc' : 'desc' }, { id: 'asc' }]

  const [notes, total] = await prisma.$transaction(
    [
      // Attachments are loaded with rows; move binary data to object storage if the dataset grows.
      prisma.note.findMany({
        where,
        include: includeNote,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.note.count({ where }),
    ],
    { isolationLevel: 'RepeatableRead' },
  )

  return {
    data: notes.map(presentNote),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }
}

export async function findNote(id: string) {
  const note = await prisma.note.findUnique({ where: { id }, include: includeNote })
  if (!note) throw new HttpError(404, 'ไม่พบโน้ตที่ต้องการ')
  return note
}

export async function saveNote(value: unknown, user: User, id?: string) {
  const input = noteInput(value)
  if (id) await authorizeNote(id, user)

  const [subject, grade] = await Promise.all([
    prisma.subject.findUnique({ where: { code: input.subjectCode } }),
    prisma.gradeLevel.findUnique({ where: { code: input.gradeCode } }),
  ])
  if (!subject || !grade) throw new HttpError(400, 'ไม่พบวิชาหรือระดับชั้นที่เลือก')

  await ensureProfile(user)
  const data = {
    ...input,
    attachment: input.attachment === null ? Prisma.DbNull : input.attachment,
  }

  const note = id
    ? await prisma.note.update({ where: { id }, data, include: includeNote })
    : await prisma.note.create({
        data: { ...data, authorId: user.id },
        include: includeNote,
      })

  return presentNote(note)
}

export async function authorizeNote(id: string, user: User) {
  const note = await findNote(id)
  assertOwnership(note.authorId, user)
  return note
}
