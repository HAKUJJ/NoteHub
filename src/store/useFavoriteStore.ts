import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note } from '../types'

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

interface FavoriteState {
  items: FavoriteItem[]
  toggleFavorite: (item: NewFavorite) => void
  removeFavorite: (kind: FavoriteItem['kind'], id: string) => void
  isFavorite: (kind: FavoriteItem['kind'], id: string) => boolean
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavorite: (item) => {
        const exists = get().items.some((favorite) => favorite.kind === item.kind && favorite.id === item.id)
        set((state) => ({
          items: exists
            ? state.items.filter((favorite) => !(favorite.kind === item.kind && favorite.id === item.id))
            : [{ ...item, savedAt: Date.now() }, ...state.items],
        }))
      },
      removeFavorite: (kind, id) =>
        set((state) => ({ items: state.items.filter((favorite) => !(favorite.kind === kind && favorite.id === id)) })),
      isFavorite: (kind, id) => get().items.some((favorite) => favorite.kind === kind && favorite.id === id),
    }),
    { name: 'noteshub-favorites' },
  ),
)
