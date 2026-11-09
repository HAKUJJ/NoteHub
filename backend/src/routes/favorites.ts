import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { HttpError } from '../middleware/errors.js'
import { object, text, uuid } from '../validators/input.js'
import { ensureProfile, findNote, includeNote, presentNote } from '../services/notes.js'

export const favorites = Router()
favorites.use(requireAuth)
favorites.get('/',async(_req,res) => {
  const userId=res.locals.user.id
  const [notes,books]=await prisma.$transaction([
    prisma.favorite.findMany({where:{userId},include:{note:{include:includeNote}}}),
    prisma.bookFavorite.findMany({where:{userId}}),
  ])
  const data=[...notes.map(f=>({kind:'note',id:f.noteId,title:f.note.title,subtitle:f.note.author.displayName,note:presentNote(f.note),savedAt:f.createdAt.getTime()})),...books.map(f=>({kind:'book',id:f.bookId,title:f.title,subtitle:f.subtitle,coverId:f.coverId,savedAt:f.createdAt.getTime()}))].sort((a,b)=>b.savedAt-a.savedAt)
  res.json({success:true,data})
})
favorites.post('/',async(req,res) => {
  const b=object(req.body)
  if(Object.keys(b).some(k=>!['noteId','kind','id','title','subtitle','coverId'].includes(k))) throw new HttpError(400,'มีฟิลด์ที่ไม่อนุญาต')
  const userId=res.locals.user.id
  await ensureProfile(res.locals.user)
  if(b.kind === 'book') {
    const bookId=text(b.id,'Book ID',30)
    if(!/^OL\d+W$/.test(bookId)) throw new HttpError(400,'Book ID ไม่ถูกต้อง')
    if(b.coverId != null && (!Number.isInteger(b.coverId) || Number(b.coverId)<1 || Number(b.coverId)>2147483647)) throw new HttpError(400,'Cover ID ไม่ถูกต้อง')
    await prisma.bookFavorite.upsert({where:{userId_bookId:{userId,bookId}},update:{},create:{userId,bookId,title:text(b.title,'ชื่อหนังสือ',500),subtitle:text(b.subtitle ?? '','ผู้เขียน',1000,true),coverId:b.coverId as number|null|undefined}})
  } else {
    if(b.kind !== undefined && b.kind !== 'note') throw new HttpError(400,'ชนิดรายการโปรดไม่ถูกต้อง')
    const noteId=uuid(b.noteId ?? b.id)
    await findNote(noteId)
    await prisma.favorite.upsert({where:{userId_noteId:{userId,noteId}},update:{},create:{userId,noteId}})
  }
  res.status(201).json({success:true})
})
favorites.delete('/:noteId',async(req,res) => {
  const userId=res.locals.user.id
  const raw=String(req.params.noteId)
  if(req.query.kind === 'book') {
    if(!/^OL\d+W$/.test(raw)) throw new HttpError(400,'Book ID ไม่ถูกต้อง')
    await prisma.bookFavorite.deleteMany({where:{userId,bookId:raw}})
  } else await prisma.favorite.deleteMany({where:{userId,noteId:uuid(raw)}})
  res.json({success:true})
})
