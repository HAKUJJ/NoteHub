import { create } from 'zustand'

// Demo-only credentials carried over from the old validation.js. Client-side checks are not real
// authentication: replace with a backend login before shipping.
const ADMIN_EMAILS = ['admin@notehub.com']
const ADMIN_PASSWORD = '12345678'

interface AuthState {
  isAdmin: boolean
  login: (email: string, password: string) => 'admin' | 'user'
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  login: (email, password) => {
    const isAdmin = ADMIN_EMAILS.includes(email.trim().toLowerCase()) && password === ADMIN_PASSWORD
    set({ isAdmin })
    return isAdmin ? 'admin' : 'user'
  },
  logout: () => set({ isAdmin: false }),
}))
