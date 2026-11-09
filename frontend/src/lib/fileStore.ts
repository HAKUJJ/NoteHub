export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']



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

export async function encodeFile(file: File) {
  const error=validateFile(file)
  if(error) throw new Error(error)
  const data=await new Promise<string>((resolve,reject)=>{
    const reader=new FileReader()
    reader.onload=()=>resolve(String(reader.result).split(',')[1])
    reader.onerror=()=>reject(new Error('อ่านไฟล์ไม่สำเร็จ'))
    reader.readAsDataURL(file)
  })
  return {name:file.name,type:file.type,size:file.size,data}
}
