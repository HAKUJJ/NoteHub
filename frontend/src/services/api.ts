import { useAuthStore } from '../store/authStore'
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}
export async function api<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = useAuthStore.getState().accessToken
  const response = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(15000), ...options, headers: { ...(options.body ? {'Content-Type':'application/json'} : {}), ...(token ? {Authorization:`Bearer ${token}`} : {}), ...options.headers } })
  if(response.status === 401 && retry && token && !path.startsWith('/auth/')) {
    if(await useAuthStore.getState().refresh()) return api<T>(path,options,false)
  }
  const result = await response.json().catch(()=>({message:'เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง'}))
  if(!response.ok) throw new ApiError(response.status,result.message || 'เชื่อมต่อ API ไม่สำเร็จ')
  return result as T
}
export const json = (method: string, body?: unknown): RequestInit => ({method,...(body === undefined ? {} : {body:JSON.stringify(body)})})
