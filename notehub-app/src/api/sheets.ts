import { sheetsSeed } from '../data/seed'
import type { Sheet } from '../types'

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms))

let sheets: Sheet[] = [...sheetsSeed]

export async function fetchSheets(): Promise<Sheet[]> {
  await delay()
  return [...sheets]
}

export async function approveSheet(id: number): Promise<void> {
  await delay()
  sheets = sheets.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
}

export async function updateSheet(id: number, patch: Pick<Sheet, 'title' | 'author' | 'grade'>): Promise<void> {
  await delay()
  sheets = sheets.map((s) => (s.id === id ? { ...s, ...patch } : s))
}

export async function deleteSheet(id: number): Promise<void> {
  await delay()
  sheets = sheets.filter((s) => s.id !== id)
}
