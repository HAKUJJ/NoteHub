import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Demo-only credentials carried over from the old validation.js. Client-side checks are not real
// authentication: replace with a backend login before shipping.
const ADMIN_EMAILS = ['admin@notehub.com']
const ADMIN_PASSWORD = '12345678'

export interface AuthUser {
  name: string
  email: string
}

interface AuthState {
  /** ผู้ใช้ที่ล็อกอินอยู่ (null = ยังไม่ได้ล็อกอิน) */
  user: AuthUser | null
  isAdmin: boolean
  login: (email: string, password: string) => 'admin' | 'user'
  register: (name: string, email: string) => void
  logout: () => void
}

// persist = เก็บสถานะลง localStorage ของเบราว์เซอร์ รีเฟรชหน้าแล้วยังล็อกอินอยู่
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      login: (email, password) => {
        const cleanEmail = email.trim().toLowerCase()
        const isAdmin = ADMIN_EMAILS.includes(cleanEmail) && password === ADMIN_PASSWORD
        // ยังไม่มีฐานข้อมูลผู้ใช้ จึงใช้ส่วนหน้าของอีเมลเป็นชื่อที่แสดง
        const name = isAdmin ? 'Administrator' : cleanEmail.split('@')[0]
        set({ user: { name, email: cleanEmail }, isAdmin })
        return isAdmin ? 'admin' : 'user'
      },
      register: (name, email) => set({ user: { name: name.trim(), email: email.trim().toLowerCase() }, isAdmin: false }),
      logout: () => set({ user: null, isAdmin: false }),
    }),
    { name: 'noteshub-auth' },
  ),
)
