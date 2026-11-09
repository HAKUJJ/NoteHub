export type Subject = 'math' | 'science' | 'english' | 'thai' | 'social'
export type Grade = 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'junior' | 'senior'
export type NoteType = 'note' | 'exam'

export interface Note {
  id: string
  title: string
  subject: string
  category: Subject
  grade: Grade
  type: NoteType
  author: string
  /** Ownership is checked by the backend against the verified Auth UUID. */
  authorId?: string
  authorAvatar?: string | null
  content?: string
  status?: SheetStatus
  createdAt?: string
  updatedAt?: string
  description?: string
  pages?: number
  image?: string | null
  topics?: string[]
  relatedBookSubject?: string
  /** Attachment metadata; the file is persisted by the backend. */
  attachment?: { name: string; size: number; type: string; data?: string }
}

export type NewNote = Omit<Note, 'id'>

export type SheetStatus = 'pending' | 'approved'

export interface Sheet {
  id: string
  title: string
  author: string
  grade: string
  status: SheetStatus
}
