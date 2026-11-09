import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createNote, updateNote, deleteNote, fetchNote, fetchNotes, fetchNotePage } from '../api/notes'
import { useFilterStore } from '../store/filterStore'
export function useNotes() { return useQuery({ queryKey: ['notes','all'], queryFn: fetchNotes }) }
export function useNote(id: string) {
  return useQuery({ queryKey:['notes',id],queryFn:()=>fetchNote(id),enabled:!!id,retry:false })
}
function useNoteMutation<T,R>(fn:(v:T)=>Promise<R>) {
  const client=useQueryClient()
  return useMutation({mutationFn:fn,onSuccess:async()=>{
    await Promise.all([client.invalidateQueries({queryKey:['notes']}),client.invalidateQueries({queryKey:['favorites']}),client.invalidateQueries({queryKey:['sheets']})])
  }})
}
export const useCreateNote=()=>useNoteMutation(createNote)
export const useUpdateNote=()=>useNoteMutation(updateNote)
export const useDeleteNote=()=>useNoteMutation(deleteNote)
export function useFilteredNotes() {
  const {subject,grade,keyword,page,type,sort}=useFilterStore()
  const result=useQuery({queryKey:['notes','list',{subject,grade,keyword,page,type,sort}],queryFn:()=>fetchNotePage({subject,grade,search:keyword,page,type,sort,limit:12})})
  return {...result,notes:result.data?.data ?? [],pagination:result.data?.pagination}
}

export const useSaveNote=(id?:string)=>useNoteMutation((input:import('../types').NewNote)=>id ? updateNote({id,input}) : createNote(input))
