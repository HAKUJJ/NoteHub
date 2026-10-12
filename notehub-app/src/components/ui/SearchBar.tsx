import { useState, type FormEvent } from 'react'
import { useFilterStore } from '../../store/filterStore'

export default function SearchBar({ className = '', large = false }: { className?: string; large?: boolean }) {
  const keyword = useFilterStore((s) => s.keyword)
  const setKeyword = useFilterStore((s) => s.setKeyword)
  const [draft, setDraft] = useState(keyword)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setKeyword(draft.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`} role="search">
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="ค้นหาชื่อวิชาหรือหัวข้อโน้ต..."
        className={`input input-bordered w-full max-w-xl border border-gray-300 bg-white ${large ? 'input-lg' : ''}`}
      />
      <button type="submit" className={`btn btn-primary ${large ? 'btn-lg' : ''}`}>ค้นหา</button>
    </form>
  )
}
