import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createNote, fetchNote, fetchNotes } from '../api/notes'
import { useFilterStore } from '../store/filterStore'

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
        (grade === 'all' || n.grade === grade) &&
        (kw === '' || n.title.toLowerCase().includes(kw) || n.subject.toLowerCase().includes(kw)),
    )
  }, [data, subject, grade, keyword])

  return { notes, isLoading, isError }
}
