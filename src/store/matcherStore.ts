import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { MatchResult } from '../lib/matcher'

interface MatcherState {
  selected: string[]
  results: MatchResult[] | null
  setSelected: (updater: (prev: string[]) => string[]) => void
  setResults: (results: MatchResult[] | null) => void
  reset: () => void
}

// เก็บคำตอบและผล Matcher ไว้ใน sessionStorage: ออกไปดูหน้าสาขาแล้วกดกลับมา ผลยังอยู่
// (ปิดแท็บแล้วจะเริ่มใหม่)
export const useMatcherStore = create<MatcherState>()(
  persist(
    (set) => ({
      selected: [],
      results: null,
      setSelected: (updater) => set((state) => ({ selected: updater(state.selected) })),
      setResults: (results) => set({ results }),
      reset: () => set({ selected: [], results: null }),
    }),
    { name: 'noteshub-matcher', storage: createJSONStorage(() => sessionStorage) },
  ),
)
