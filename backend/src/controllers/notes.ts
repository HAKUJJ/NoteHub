import type { RequestHandler } from 'express'
import { prisma } from '../lib/prisma.js'
import { uuid } from '../validators/input.js'
import { authorizeNote, findNote, listNotes, presentNote, saveNote } from '../services/notes.js'
import { HttpError } from '../middleware/errors.js'

export const list: RequestHandler = async (req, res) => {
  res.json({ success: true, ...await listNotes(req.query) })
}

export const detail: RequestHandler = async (req, res) => {
  const note = await findNote(uuid(req.params.id))
  res.json({ success: true, data: presentNote(note) })
}

export const create: RequestHandler = async (req, res) => {
  const note = await saveNote(req.body, res.locals.user)
  res.status(201).json({ success: true, data: note })
}

export const update: RequestHandler = async (req, res) => {
  const note = await saveNote(req.body, res.locals.user, uuid(req.params.id))
  res.json({ success: true, data: note })
}

export const remove: RequestHandler = async (req, res) => {
  const id = uuid(req.params.id)
  await authorizeNote(id, res.locals.user)
  // Database cascades delete the dependent favorites atomically.
  await prisma.note.delete({ where: { id } })
  res.json({ success: true, message: 'ลบโน้ตแล้ว' })
}

export const attachment: RequestHandler = async (req, res) => {
  const n = await findNote(uuid(req.params.id))
  const a = n.attachment as { name: string; data: string } | null
  if (!a) throw new HttpError(404, 'ไม่พบไฟล์แนบ')

  res
    .type('application/octet-stream')
    .set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(a.name)}`)
    .send(Buffer.from(a.data, 'base64'))
}
