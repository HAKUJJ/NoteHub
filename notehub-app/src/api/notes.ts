import { notesSeed } from '../data/seed'
import type { NewNote, Note } from '../types'

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// In-memory stand-in for a backend; swap these functions for fetch() calls later.
let notes: Note[] = [...notesSeed]

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
  notes = [note, ...notes]
  return note
}
