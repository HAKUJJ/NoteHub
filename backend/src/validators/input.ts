import { HttpError } from '../middleware/errors.js'

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'ข้อมูลต้องเป็น JSON object')
  return value as Record<string, unknown>
}
export function text(value: unknown, name: string, max: number, allowEmpty = false): string {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim()) || value.length > max) throw new HttpError(400, `${name} ไม่ถูกต้อง (สูงสุด ${max} ตัวอักษร)`)
  return value.trim()
}
export function uuid(value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new HttpError(400, 'ID ต้องเป็น UUID')
  return value
}
export function integer(value: unknown, fallback: number, max: number): number {
  if (value === undefined) return fallback
  if (typeof value !== 'string' || !/^\d+$/.test(value) || Number(value) < 1 || Number(value) > max) throw new HttpError(400, 'เลขหน้า/จำนวนรายการไม่ถูกต้อง')
  return Number(value)
}
export function noteInput(value: unknown) {
  const b = object(value)
  if (Object.keys(b).some(k => !['title','description','content','subjectCode','subjectName','gradeCode','type','attachment'].includes(k))) throw new HttpError(400, 'มีฟิลด์ที่ไม่อนุญาต')
  const type = text(b.type, 'ประเภท', 10)
  if (!['note','exam'].includes(type)) throw new HttpError(400, 'ประเภทต้องเป็น note หรือ exam')
  let attachment: { name: string; type: string; size: number; data: string } | null = null
  if (b.attachment != null) {
    const a = object(b.attachment)
    const name = text(a.name, 'ชื่อไฟล์', 255)
    const mime = text(a.type, 'ชนิดไฟล์', 100, true)
    if (!/\.(pdf|doc|docx|png|jpe?g)$/i.test(name)) throw new HttpError(400, 'นามสกุลไฟล์ไม่ถูกต้อง')
    if (typeof a.data !== 'string' || a.data.length > 4_194_304 || a.data.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(a.data)) throw new HttpError(400, 'ข้อมูลไฟล์ไม่ถูกต้อง')
    const size = Buffer.byteLength(a.data, 'base64')
    if (!size || size > 3 * 1024 * 1024 || size !== a.size) throw new HttpError(400, 'ขนาดไฟล์ไม่ถูกต้อง (สูงสุด 3 MB)')
    attachment = { name, type: mime, size, data: a.data }
  }
  return { title: text(b.title, 'ชื่อโน้ต', 200), description: text(b.description ?? '', 'คำอธิบาย', 10000, true), content: text(b.content ?? '', 'เนื้อหา', 100000, true), subjectCode: text(b.subjectCode, 'วิชา', 20), subjectName: text(b.subjectName ?? '', 'รายวิชา', 100, true), gradeCode: text(b.gradeCode, 'ระดับชั้น', 20), type, ...(b.attachment !== undefined ? { attachment } : {}) }
}
