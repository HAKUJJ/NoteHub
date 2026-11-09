import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, json } from '../services/api'
import { queryClient } from '../lib/queryClient'
export type Role = 'admin' | 'user'
export interface AuthUser { id: string; name: string; email: string; role: Role }
interface Session { user: AuthUser; accessToken: string; refreshToken: string }
interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAdmin: boolean
  authError: string
  login: (email: string,password: string) => Promise<Role>
  register: (name: string,email: string,password: string) => Promise<boolean>
  logout: () => Promise<void>
  refresh: () => Promise<boolean>
  initialize: () => Promise<void>
}
let refreshing: Promise<boolean> | null = null
const empty = {user:null,accessToken:null,refreshToken:null,isAdmin:false}
export const useAuthStore = create<AuthState>()(persist((set,get)=>({
  ...empty,authError:'',
  login: async(email,password)=>{
    const {data}=await api<{data:Session}>('/auth/login',json('POST',{email,password}))
    queryClient.clear()
    set({...data,isAdmin:data.user.role === 'admin',authError:''})
    return data.user.role
  },
  register: async(name,email,password)=>{
    const {data}=await api<{data:Session|null}>('/auth/register',json('POST',{name,email,password}))
    if(!data) return false
    queryClient.clear()
    set({...data,isAdmin:data.user.role === 'admin',authError:''})
    return true
  },
  logout: async()=>{
    try { await api('/auth/logout',json('POST')) }
    catch { set({authError:'ล้างเซสชันในเครื่องแล้ว แต่ยกเลิกเซสชันที่เซิร์ฟเวอร์ไม่สำเร็จ'}) }
    finally { set(empty);queryClient.clear() }
  },
  refresh: ()=>{
    if(refreshing) return refreshing
    if(!get().refreshToken) return Promise.resolve(false)
    refreshing=(async()=>{
      try {
        const {data}=await api<{data:Session}>('/auth/refresh',json('POST',{refreshToken:get().refreshToken}),false)
        set({...data,isAdmin:data.user.role === 'admin'})
        return true
      } catch { set(empty);queryClient.clear();return false }
      finally { refreshing=null }
    })()
    return refreshing
  },
  initialize: async()=>{
    if(!get().accessToken) return
    try {
      let response=await api<{data:AuthUser}>('/auth/me',{},false).catch(()=>null)
      if(!response && await get().refresh()) response=await api<{data:AuthUser}>('/auth/me',{},false)
      if(response) set({user:response.data,isAdmin:response.data.role === 'admin'})
      else set(empty)
    } catch { set(empty) }
  },
}),{name:'noteshub-session-v2',partialize:({user,accessToken,refreshToken,isAdmin})=>({user,accessToken,refreshToken,isAdmin})}))
