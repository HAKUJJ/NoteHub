// เก็บไฟล์แนบของโพสต์ไว้ใน IndexedDB ของเบราว์เซอร์ (รับไฟล์ใหญ่ได้กว่า localStorage)
// ยังไม่มี server: ไฟล์จึงอยู่เฉพาะในเบราว์เซอร์เครื่องที่อัปโหลด

const DB_NAME = 'noteshub-files'
const STORE = 'attachments'

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']

export interface StoredFile {
  name: string
  type: string
  size: number
  blob: Blob
}

/** ตรวจไฟล์ก่อนโพสต์: คืนข้อความ error หรือ '' ถ้าผ่าน */
export function validateFile(file: File): string {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) return 'รองรับเฉพาะไฟล์ .pdf .doc .docx .png .jpg'
  if (file.size > MAX_FILE_SIZE) return `ไฟล์ใหญ่เกินไป (${formatFileSize(file.size)}) ขนาดสูงสุด 5 MB`
  return ''
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = action(db.transaction(STORE, mode).objectStore(STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  }).finally(() => db.close()) as Promise<T>
}

export function saveFile(noteId: number, file: File) {
  const stored: StoredFile = { name: file.name, type: file.type, size: file.size, blob: file }
  return run('readwrite', (store) => store.put(stored, noteId))
}

export async function getFile(noteId: number): Promise<StoredFile | null> {
  return ((await run('readonly', (store) => store.get(noteId))) as StoredFile | undefined) ?? null
}

export function deleteFile(noteId: number) {
  return run('readwrite', (store) => store.delete(noteId))
}
