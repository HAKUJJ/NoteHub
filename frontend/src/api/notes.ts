import type { NewNote, Note } from '../types'
import { api,json } from '../services/api'
export interface NotePage { data: Note[]; pagination: { page: number; limit: number; total: number; pages: number } }
export const fetchNotePage = (params: Record<string,string|number> = {}) => api<NotePage>(`/notes?${new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)]))}`)
export async function fetchNotes(): Promise<Note[]> {
  const first=await fetchNotePage({limit:100})
  const notes=[...first.data]
  for(let page=2;page<=first.pagination.pages;page++) notes.push(...(await fetchNotePage({page,limit:100})).data)
  return notes
}
export async function fetchNote(id: string): Promise<Note> { return (await api<{data:Note}>(`/notes/${encodeURIComponent(id)}`)).data }
export const noteBody = (n: NewNote) => ({title:n.title,description:n.description || '',content:n.content || '',subjectCode:n.category,subjectName:n.subject,gradeCode:n.grade,type:n.type,...(n.attachment !== undefined ? {attachment:n.attachment} : {}),...(n.image !== undefined ? {image:n.image} : {})})
export async function createNote(input: NewNote): Promise<Note> { return (await api<{data:Note}>('/notes',json('POST',noteBody(input)))).data }
export async function updateNote({id,input}:{id:string;input:NewNote}): Promise<Note> { return (await api<{data:Note}>(`/notes/${id}`,json('PUT',noteBody(input)))).data }
export async function deleteNote(id: string): Promise<void> { await api(`/notes/${id}`,json('DELETE')) }
