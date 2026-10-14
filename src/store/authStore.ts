import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Demo-only credentials carried over from the old validation.js. Client-side checks are not real
// authentication: replace with a backend login before shipping.
export type Role = 'admin' | 'user'

const DEMO_ACCOUNTS: { email: string; password: string; name: string; role: Role }[] = [
  { email: 'admin@notehub.com', password: '12345678', name: 'Administrator', role: 'admin' },
  { email: 'user@notehub.com', password: '12345678', name: 'User', role: 'user' },
]

export interface AuthUser {
  name: string
  email: string
  role?: Role
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
        const account = DEMO_ACCOUNTS.find((a) => a.email === cleanEmail && a.password === password)
        const role: Role = account?.role ?? 'user'
        const isAdmin = role === 'admin'
        // ยังไม่มีฐานข้อมูลผู้ใช้ จึงใช้ส่วนหน้าของอีเมลเป็นชื่อที่แสดง
        const name = account?.name ?? cleanEmail.split('@')[0]
        set({ user: { name, email: cleanEmail, role }, isAdmin })
        return role
      },
      register: (name, email) => set({ user: { name: name.trim(), email: email.trim().toLowerCase() }, isAdmin: false }),
      logout: () => set({ user: null, isAdmin: false }),
    }),
    { name: 'noteshub-auth' },
  ),
)
