import { api,json } from '../services/api'
import { fetchNotes,deleteNote,fetchNote,updateNote } from './notes'
import type { Sheet } from '../types'
export async function fetchSheets(): Promise<Sheet[]> {
  return (await fetchNotes()).map(n=>({id:n.id,title:n.title,author:n.author,grade:n.grade,status:n.status ?? 'approved'}))
}
export async function approveSheet(id:string): Promise<void> { await api(`/notes/${id}/approve`,json('PATCH')) }
export const deleteSheet=deleteNote
export async function updateSheet(id:string,patch:Pick<Sheet,'title'|'author'|'grade'>):Promise<void> {
  const note=await fetchNote(id)
  await updateNote({id,input:{...note,title:patch.title,grade:patch.grade as typeof note.grade}})
}
