import { useQuery } from '@tanstack/react-query'
import { fetchBook, searchBooks } from '../api/openLibrary'

export function useBooks(subject: string, query: string) {
  return useQuery({
    queryKey: ['books', subject, query],
    queryFn: ({ signal }) => searchBooks({ subject, query, signal }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: ({ signal }) => fetchBook(id, signal),
    enabled: Boolean(id),
    retry: false,
    staleTime: 10 * 60 * 1000,
  })
}
