import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveSheet, deleteSheet, fetchSheets, updateSheet } from '../api/sheets'
import type { Sheet } from '../types'

const KEY = ['sheets']

export function useSheets() {
  return useQuery({ queryKey: KEY, queryFn: fetchSheets })
}

function useSheetMutation<TVars>(fn: (vars: TVars) => Promise<void>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

export const useApproveSheet = () => useSheetMutation((id: number) => approveSheet(id))
export const useDeleteSheet = () => useSheetMutation((id: number) => deleteSheet(id))
export const useUpdateSheet = () =>
  useSheetMutation((v: { id: number; patch: Pick<Sheet, 'title' | 'author' | 'grade'> }) =>
    updateSheet(v.id, v.patch),
  )
