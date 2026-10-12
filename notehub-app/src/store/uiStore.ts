import { create } from 'zustand'

type AuthModal = 'login' | 'register' | null

interface UiState {
  authModal: AuthModal
  openAuthModal: (type: Exclude<AuthModal, null>) => void
  closeAuthModal: () => void
}

export const useUiStore = create<UiState>((set) => ({
  authModal: null,
  openAuthModal: (type) => set({ authModal: type }),
  closeAuthModal: () => set({ authModal: null }),
}))