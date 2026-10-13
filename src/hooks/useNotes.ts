import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createNote, fetchNote, fetchNotes } from '../api/notes'
import { useFilterStore, type GradeFilter } from '../store/filterStore'
import type { Grade, Note } from '../types'

const juniorGrades: Grade[] = ['m1', 'm2', 'm3', 'junior']
const seniorGrades: Grade[] = ['m4', 'm5', 'm6', 'senior']

/** เช็กว่าระดับชั้นของโน้ตตรงกับตัวกรองหรือไม่
 * - เลือก "มัธยมต้น" → ได้ ม.1-ม.3 และโน้ตที่ติดป้าย ม.ต้น
 * - เลือก "ม.5" → ได้ ม.5 และโน้ตที่ติดป้าย ม.ปลาย (เพราะครอบคลุม ม.5 ด้วย) */
export function matchesGrade(noteGrade: Grade, filter: GradeFilter): boolean {
  if (filter === 'all' || noteGrade === filter) return true
  if (filter === 'junior') return juniorGrades.includes(noteGrade)
  if (filter === 'senior') return seniorGrades.includes(noteGrade)
  if (noteGrade === 'junior') return juniorGrades.includes(filter)
  if (noteGrade === 'senior') return seniorGrades.includes(filter)
  return false
}

/** ค้นจากชื่อโน้ต วิชา ผู้โพสต์ คำอธิบาย และหัวข้อในโน้ต */
function matchesKeyword(note: Note, kw: string): boolean {
  if (kw === '') return true
  const fields = [note.title, note.subject, note.author, note.description ?? '', ...(note.topics ?? [])]
  return fields.some((f) => f.toLowerCase().includes(kw))
}

export function useNotes() {
  return useQuery({ queryKey: ['notes'], queryFn: fetchNotes })
}

export function useNote(id: number) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => fetchNote(id),
    enabled: Number.isInteger(id),
    retry: false,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export function useFilteredNotes() {
  const { data, isLoading, isError } = useNotes()
  const subject = useFilterStore((s) => s.subject)
  const grade = useFilterStore((s) => s.grade)
  const keyword = useFilterStore((s) => s.keyword)

  const notes = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return (data ?? []).filter(
      (n) =>
        (subject === 'all' || n.category === subject) &&
        matchesGrade(n.grade, grade) &&
        matchesKeyword(n, kw),
    )
  }, [data, subject, grade, keyword])

  return { notes, isLoading, isError }
}
