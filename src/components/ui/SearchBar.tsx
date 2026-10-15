import { useEffect, useState, type FormEvent } from 'react'
import { useFilterStore } from '../../store/filterStore'

export default function SearchBar({ className = '', large = false }: { className?: string; large?: boolean }) {
  const keyword = useFilterStore((s) => s.keyword)
  const setKeyword = useFilterStore((s) => s.setKeyword)
  const [draft, setDraft] = useState(keyword)

  // ถ้าคำค้นถูกล้างจากที่อื่น (เช่นปุ่ม "ล้างตัวกรอง") ให้ช่องค้นหาว่างตาม
  useEffect(() => setDraft(keyword), [keyword])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setKeyword(draft.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`} role="search">
      <input
        type="search"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value)
          // กด ✕ หรือลบจนช่องว่าง → แสดงผลทั้งหมดทันที ไม่ต้องกดค้นหาซ้ำ
          if (e.target.value === '') setKeyword('')
        }}
        placeholder="ค้นหาชื่อวิชาหรือหัวข้อโน้ต..."
        className={`input input-bordered w-full max-w-xl bg-white border-none focus:outline-none focus:ring-0 ${large ? 'md:input-lg' : ''}`}
      />
      <button type="submit" className={`btn btn-primary border-none shadow hover:text-black hover:bg-accent rounded-2xl ${large ? 'md:btn-lg' : ''}`}>ค้นหา</button>
    </form>
  )
}
