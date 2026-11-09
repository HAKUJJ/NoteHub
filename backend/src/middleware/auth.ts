import type { RequestHandler } from 'express'
import type { User } from '@supabase/supabase-js'
import { authClient } from '../lib/supabase.js'
import { HttpError } from './errors.js'

declare global { namespace Express { interface Locals { user: User; token: string } } }

export const requireAuth: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (!token) throw new HttpError(401, 'กรุณาเข้าสู่ระบบ')
  const { data, error } = await authClient().auth.getUser(token)
  if (error || !data.user) throw new HttpError(401, 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่')
  res.locals.user = data.user
  res.locals.token = token
  next()
}

export const requireAdmin: RequestHandler = (_req, res, next) => {
  if (res.locals.user.app_metadata.role !== 'admin') throw new HttpError(403, 'เฉพาะผู้ดูแลระบบ')
  next()
}

export function assertOwnership(authorId: string, user: User) {
  if (authorId !== user.id && user.app_metadata.role !== 'admin') throw new HttpError(403, 'แก้ไขหรือลบได้เฉพาะเจ้าของโน้ต')
}
