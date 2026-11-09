import { create } from 'zustand'
import type { Grade, Subject } from '../types'

export type SubjectFilter = Subject | 'all'
export type GradeFilter = Grade | 'all'

interface FilterState {
  subject: SubjectFilter
  grade: GradeFilter
  keyword: string
  page: number
  type: string
  sort: string
  setPage: (page:number)=>void
  setType: (type:string)=>void
  setSort: (sort:string)=>void
  setSubject: (subject: SubjectFilter) => void
  setGrade: (grade: GradeFilter) => void
  setKeyword: (keyword: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  subject: 'all',
  grade: 'all',
  keyword: '',
  page:1,type:'all',sort:'newest',
  setPage:page=>set({page}),
  setType:type=>set({type,page:1}),
  setSort:sort=>set({sort,page:1}),
  setSubject: (subject) => set({ subject,page:1 }),
  setGrade: (grade) => set({ grade,page:1 }),
  setKeyword: (keyword) => set({ keyword,page:1 }),
  resetFilters: () => set({ subject: 'all', grade: 'all', keyword: '',page:1,type:'all',sort:'newest' }),
}))
