import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
export const useSubjects = () => useQuery({queryKey:['subjects'],queryFn:async()=> (await api<{data:{code:string;name:string}[]}>('/subjects')).data})
export const useGrades = () => useQuery({queryKey:['grades'],queryFn:async()=> (await api<{data:{code:string;name:string;sortOrder:number}[]}>('/grades')).data})
