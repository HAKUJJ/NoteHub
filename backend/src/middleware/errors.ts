import type { ErrorRequestHandler } from 'express'
import { Prisma } from '@prisma/client'

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let status = error instanceof HttpError ? error.status : 500
  let message = error instanceof HttpError ? error.message : 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') { status = 409; message = 'ข้อมูลนี้มีอยู่แล้ว' }
    if (error.code === 'P2025') { status = 404; message = 'ไม่พบข้อมูลที่ต้องการ' }
    if (error.code === 'P2003') { status = 400; message = 'ข้อมูลอ้างอิงไม่ถูกต้อง' }
  }
  if (error?.type === 'entity.too.large') { status = 413; message = 'ไฟล์หรือข้อมูลมีขนาดใหญ่เกินไป' }
  if (error?.type === 'entity.parse.failed') { status = 400; message = 'JSON ไม่ถูกต้อง' }
  // Never return database connection strings, queries, credentials or stack traces.
  if (status === 500) console.error('Request failed:', error?.code || error?.name || 'unknown')
  res.status(status).json({ success: false, message })
}
