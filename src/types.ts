export type Subject = 'math' | 'science' | 'english' | 'thai' | 'social'
export type Grade = 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'junior' | 'senior'
export type NoteType = 'note' | 'exam'

export interface Note {
  id: number
  title: string
  subject: string
  category: Subject
  grade: Grade
  type: NoteType
  author: string
  /** อีเมลของคนโพสต์ ใช้เช็กว่าเป็นเจ้าของโพสต์ (โน้ตตัวอย่างไม่มี) */
  authorEmail?: string
  description?: string
  pages?: number
  image?: string
  topics?: string[]
  relatedBookSubject?: string
}

export type NewNote = Omit<Note, 'id'>

export type SheetStatus = 'pending' | 'approved'

export interface Sheet {
  id: number
  title: string
  author: string
  grade: string
  status: SheetStatus
}
