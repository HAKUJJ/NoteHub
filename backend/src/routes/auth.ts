import type { User } from '@supabase/supabase-js'
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { prisma } from '../lib/prisma.js'
import { authClient } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { HttpError } from '../middleware/errors.js'
import { ensureProfile } from '../services/notes.js'
import { object, text, validateCover } from '../validators/input.js'

export const auth = Router()

const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'ลองเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่' },
})

function credentials(body: unknown) {
  const input = object(body)
  const email = text(input.email, 'อีเมล', 254)

  if (typeof input.password !== 'string' || input.password.length > 128) {
    throw new HttpError(400, 'รหัสผ่านไม่ถูกต้อง')
  }

  const password = input.password
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    throw new HttpError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (รหัสผ่านอย่างน้อย 8 ตัวอักษร)')
  }

  return { email, password }
}

function presentUser(user: User, name: string, avatar: string | null) {
  return {
    id: user.id,
    email: user.email,
    name,
    avatar,
    role: user.app_metadata.role === 'admin' ? 'admin' : 'user',
  }
}

auth.post('/login', limit, async (req, res) => {
  const { data, error } = await authClient().auth.signInWithPassword(credentials(req.body))
  if (error || !data.session) {
    throw new HttpError(401, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่ได้ยืนยันอีเมล')
  }

  const profile = await ensureProfile(data.user)
  res.json({
    success: true,
    data: {
      user: presentUser(data.user, profile.displayName, profile.avatar),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    },
  })
})

auth.post('/register', limit, async (req, res) => {
  const input = credentials(req.body)
  const name = text(object(req.body).name, 'ชื่อ', 100)
  const { data, error } = await authClient().auth.signUp({
    ...input,
    options: { data: { display_name: name } },
  })

  if (error) {
    throw new HttpError(
      error.status === 429 ? 429 : 400,
      'สมัครสมาชิกไม่สำเร็จ กรุณาตรวจข้อมูลและลองอีกครั้ง',
    )
  }

  if (data.session && data.user) {
    const profile = await ensureProfile(data.user)
    res.status(201).json({
      success: true,
      data: {
        user: presentUser(data.user, profile.displayName, profile.avatar),
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
    })
  } else {
    res.status(201).json({
      success: true,
      data: null,
      message: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ',
    })
  }
})

auth.post('/refresh', limit, async (req, res) => {
  const refreshToken = text(object(req.body).refreshToken, 'Refresh token', 4096)
  const { data, error } = await authClient().auth.refreshSession({
    refresh_token: refreshToken,
  })

  if (error || !data.session || !data.user) {
    throw new HttpError(401, 'กรุณาเข้าสู่ระบบใหม่')
  }

  const profile = await ensureProfile(data.user)
  res.json({
    success: true,
    data: {
      user: presentUser(data.user, profile.displayName, profile.avatar),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    },
  })
})

auth.get('/me', requireAuth, async (_req, res) => {
  const profile = await ensureProfile(res.locals.user)
  res.json({
    success: true,
    data: presentUser(res.locals.user, profile.displayName, profile.avatar),
  })
})

auth.patch('/me', requireAuth, async (req, res) => {
  const body = object(req.body)
  if (Object.keys(body).some((key) => key !== 'avatar')) {
    throw new HttpError(400, 'มีฟิลด์ที่ไม่อนุญาต')
  }

  validateCover(body.avatar)
  await ensureProfile(res.locals.user)
  const profile = await prisma.profile.update({
    where: { id: res.locals.user.id },
    data: { avatar: body.avatar as string },
  })

  res.json({
    success: true,
    data: presentUser(res.locals.user, profile.displayName, profile.avatar),
  })
})

auth.post('/logout', requireAuth, async (_req, res) => {
  const { error } = await authClient().auth.admin.signOut(res.locals.token, 'local')
  if (error) throw new HttpError(502, 'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง')
  res.json({ success: true })
})
