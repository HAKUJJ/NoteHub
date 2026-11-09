import { useState, type MouseEvent } from 'react'
import { Outlet } from 'react-router'
import FilterSidebar from '../ui/FilterSidebar'
import { useFilterStore } from '../../store/filterStore'
import { gradeLabels, subjectLabels } from '../../data/labels'

export default function SidebarLayout() {
  const [open, setOpen] = useState(false)
  const { subject, grade } = useFilterStore()
  const activeCount = (subject !== 'all' ? 1 : 0) + (grade !== 'all' ? 1 : 0)
  const activeLabel = [subject !== 'all' ? subjectLabels[subject] : '', grade !== 'all' ? gradeLabels[grade] : '']
    .filter(Boolean)
    .join(' · ')

  // จอมือถือ: เลือกหมวดเสร็จให้ปิดแผงเอง
  const closeOnSelect = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) setOpen(false)
  }

  return (
    <div className="flex w-full max-w-full gap-6">
      {/* จอคอม: แถบด้านซ้ายเหมือนเดิม */}
      <aside className="hidden w-64 shrink-0 self-start rounded-box bg-base-200 p-4 md:block">
        <FilterSidebar />
      </aside>

      {/* จอมือถือ: แผงเลื่อนออกมาจากด้านซ้าย ทับบนหน้าแทนการเบียดเนื้อหา */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="หมวดหมู่">
          <button className="absolute inset-0 h-full w-full bg-black/40" aria-label="ปิดหมวดหมู่" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] overflow-y-auto bg-base-200 p-4 shadow-xl" onClick={closeOnSelect}>
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" aria-label="ปิดหมวดหมู่" onClick={() => setOpen(false)}>
              ✕
            </button>
            <FilterSidebar />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1 py-4 md:py-6 border-none">
        <button className="btn btn-ghost btn-sm mb-2 gap-2 md:hidden focus:ring-0 border-none focus:outline-none rounded-box hover:bg-accent" aria-label="เปิดเมนูหมวดหมู่" onClick={() => setOpen(true)}>
          ☰ หมวดหมู่
          {activeCount > 0 && <span className="badge badge-primary badge-sm">{activeLabel}</span>}
        </button>
        <Outlet />
      </div>
    </div>
  )
}
