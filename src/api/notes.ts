import { notesSeed } from '../data/seed'
import type { NewNote, Note } from '../types'

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// ยังไม่มี backend: โพสต์ที่ผู้ใช้สร้างจะเก็บใน localStorage รีเฟรชแล้วไม่หาย
// (เห็นเฉพาะในเบราว์เซอร์เครื่องนี้) ภายหลังเปลี่ยนเป็น fetch() ไปที่ server ได้
const STORAGE_KEY = 'noteshub-user-notes'

function loadUserNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Note[]) : []
  } catch {
    return []
  }
}

function saveUserNotes(userNotes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userNotes))
  } catch {
    // localStorage ใช้ไม่ได้ (เช่นโหมดไม่ระบุตัวตน) ก็ยังใช้งานต่อได้ แค่รีเฟรชแล้วหาย
  }
}

let userNotes: Note[] = loadUserNotes()
let notes: Note[] = [...userNotes, ...notesSeed]

export async function fetchNotes(): Promise<Note[]> {
  await delay()
  return [...notes]
}

export async function fetchNote(id: number): Promise<Note> {
  await delay()
  const note = notes.find((n) => n.id === id)
  if (!note) throw new Error('ไม่พบโน้ตที่ต้องการ')
  return note
}

export async function createNote(input: NewNote): Promise<Note> {
  await delay()
  const note: Note = { ...input, id: Math.max(0, ...notes.map((n) => n.id)) + 1 }
  userNotes = [note, ...userNotes]
  saveUserNotes(userNotes)
  notes = [note, ...notes]
  return note
}

/** โน้ตที่ผู้ใช้สร้างเอง (ลบได้) ไม่ใช่โน้ตตัวอย่าง */
export function isUserNote(id: number): boolean {
  return userNotes.some((n) => n.id === id)
}

export async function deleteNote(id: number): Promise<void> {
  await delay()
  if (!isUserNote(id)) throw new Error('ลบได้เฉพาะโพสต์ที่ผู้ใช้สร้างเอง')
  userNotes = userNotes.filter((n) => n.id !== id)
  saveUserNotes(userNotes)
  notes = notes.filter((n) => n.id !== id)
}
