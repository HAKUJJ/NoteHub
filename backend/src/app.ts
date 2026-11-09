import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import { prisma } from './lib/prisma.js'
import { auth } from './routes/auth.js'
import { favorites } from './routes/favorites.js'
import { requireAuth,requireAdmin } from './middleware/auth.js'
import { errorHandler,HttpError } from './middleware/errors.js'
import * as notes from './controllers/notes.js'
import { text,uuid } from './validators/input.js'

export const app=express()
app.disable('x-powered-by')
app.use(cors({origin:config.origins}))
app.use((_req,res,next)=>{res.set('X-Content-Type-Options','nosniff').set('Cache-Control','no-store');next()})
app.use(express.json({limit:'8mb'}))
app.get('/api/health',(_req,res)=>{res.json({success:true,message:'NotesHub API is running'})})
app.get('/api/health/db',async(_req,res)=>{await prisma.$queryRaw`SELECT 1`;res.json({success:true,message:'Database connected'})})
app.use('/api/auth',auth)
app.use('/api/favorites',favorites)
app.get('/api/notes',notes.list)
app.get('/api/notes/:id',notes.detail)
app.get('/api/notes/:id/attachment',notes.attachment)
app.post('/api/notes',requireAuth,notes.create)
app.put('/api/notes/:id',requireAuth,notes.update)
app.delete('/api/notes/:id',requireAuth,notes.remove)
app.get('/api/subjects',async(_req,res)=>{res.json({success:true,data:await prisma.subject.findMany({orderBy:{code:'asc'}})})})
app.get('/api/subjects/:id',async(req,res)=>{
  const subject=await prisma.subject.findUnique({where:{code:text(req.params.id,'วิชา',20)}})
  if(!subject) throw new HttpError(404,'ไม่พบวิชา')
  res.json({success:true,data:subject})
})
app.get('/api/grades',async(_req,res)=>{res.json({success:true,data:await prisma.gradeLevel.findMany({orderBy:{sortOrder:'asc'}})})})
app.patch('/api/notes/:id/approve',requireAuth,requireAdmin,async(req,res)=>{await prisma.note.update({where:{id:uuid(req.params.id)},data:{status:'approved'}});res.json({success:true})})
app.use(()=>{throw new HttpError(404,'ไม่พบ API ที่ต้องการ')})
app.use(errorHandler)
