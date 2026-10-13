import { create } from 'zustand'
import type { Grade, Subject } from '../types'

export type SubjectFilter = Subject | 'all'
export type GradeFilter = Grade | 'all'

interface FilterState {
  subject: SubjectFilter
  grade: GradeFilter
  keyword: string
  setSubject: (subject: SubjectFilter) => void
  setGrade: (grade: GradeFilter) => void
  setKeyword: (keyword: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  subject: 'all',
  grade: 'all',
  keyword: '',
  setSubject: (subject) => set({ subject }),
  setGrade: (grade) => set({ grade }),
  setKeyword: (keyword) => set({ keyword }),
  resetFilters: () => set({ subject: 'all', grade: 'all', keyword: '' }),
}))
