import { useEffect, useState } from 'react'
import { formatFileSize } from '../../lib/fileStore'
import { API_URL } from '../../services/api'

interface Props {
  noteId: string
  info: { name: string; size: number; type: string }
}

/** แสดงไฟล์แนบของโพสต์: ชื่อ ขนาด ปุ่มดาวน์โหลด และรูปตัวอย่าง (ถ้าเป็นรูป) */
export default function Attachment({ noteId, info }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false
    fetch(`${API_URL}/notes/${noteId}/attachment`).then(async response=>{if(!response.ok) throw new Error('Download failed');return response.blob()})
      .then((file) => {
        if (cancelled) return
        if (!file) return setStatus('missing')
        // สร้างลิงก์ชั่วคราวให้ไฟล์ในเบราว์เซอร์ ใช้ดาวน์โหลด/แสดงรูปได้
        objectUrl = URL.createObjectURL(file)
        setUrl(objectUrl)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('missing'))
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [noteId])

  const isImage = info.type.startsWith('image/')

  return (
    <div className="flex flex-col gap-3 rounded-box border border-gray-200 p-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold uppercase text-primary">
          {info.name.split('.').pop()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" title={info.name}>{info.name}</p>
          <p className="text-xs opacity-60">{formatFileSize(info.size)}</p>
        </div>
      </div>
      {status === 'ready' && url && isImage && (
        <img src={url} alt={`ตัวอย่างไฟล์ ${info.name}`} className="max-h-60 w-full rounded object-contain bg-base-200/50" />
      )}
      {status === 'loading' && <span className="loading loading-spinner loading-sm self-center" aria-label="กำลังโหลดไฟล์" />}
      {status === 'ready' && url && (
        <a href={url} download={info.name} className="btn btn-primary">ดาวน์โหลดไฟล์</a>
      )}
      {status === 'missing' && (
        <p className="text-center text-sm opacity-70">โหลดไฟล์แนบไม่สำเร็จ กรุณาลองอีกครั้ง</p>
      )}
    </div>
  )
}
