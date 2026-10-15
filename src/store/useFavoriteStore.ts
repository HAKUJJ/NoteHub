import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note } from '../types'
import { useAuthStore } from './authStore'

export interface FavoriteItem {
  kind: 'note' | 'book'
  id: string
  title: string
  subtitle: string
  coverId?: number | null
  note?: Note
  savedAt: number
}

type NewFavorite = Omit<FavoriteItem, 'savedAt'>

const same = (a: Pick<FavoriteItem, 'kind' | 'id'>, kind: FavoriteItem['kind'], id: string) => a.kind === kind && a.id === id

interface FavoriteState {
  /** รายการโปรดแยกตามบัญชี: key = อีเมลของผู้ใช้ */
  byUser: Record<string, FavoriteItem[]>
  toggleFavorite: (email: string, item: NewFavorite) => void
  removeFavorite: (email: string, kind: FavoriteItem['kind'], id: string) => void
  /** ลบออกจากรายการโปรดของทุกบัญชี (ใช้ตอนโพสต์ถูกลบ) */
  removeEverywhere: (kind: FavoriteItem['kind'], id: string) => void
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      byUser: {},
      toggleFavorite: (email, item) =>
        set((state) => {
          const current = state.byUser[email] ?? []
          const exists = current.some((f) => same(f, item.kind, item.id))
          const next = exists
            ? current.filter((f) => !same(f, item.kind, item.id))
            : [{ ...item, savedAt: Date.now() }, ...current]
          return { byUser: { ...state.byUser, [email]: next } }
        }),
      removeFavorite: (email, kind, id) =>
        set((state) => ({
          byUser: { ...state.byUser, [email]: (state.byUser[email] ?? []).filter((f) => !same(f, kind, id)) },
        })),
      removeEverywhere: (kind, id) =>
        set((state) => ({
          byUser: Object.fromEntries(
            Object.entries(state.byUser).map(([email, items]) => [email, items.filter((f) => !same(f, kind, id))]),
          ),
        })),
    }),
    {
      name: 'noteshub-favorites',
      // เวอร์ชัน 1: เปลี่ยนจากรายการรวมทั้งเบราว์เซอร์ เป็นแยกตามบัญชี
      // ข้อมูลแบบเก่าไม่รู้ว่าเป็นของใคร จึงเริ่มใหม่
      version: 1,
      migrate: () => ({ byUser: {} }),
    },
  ),
)

const EMPTY: FavoriteItem[] = []

/** รายการโปรดของคนที่ล็อกอินอยู่ (ยังไม่ล็อกอิน = ว่าง) */
export function useMyFavorites(): FavoriteItem[] {
  const email = useAuthStore((s) => s.user?.email)
  return useFavoriteStore((s) => (email ? s.byUser[email] ?? EMPTY : EMPTY))
}
