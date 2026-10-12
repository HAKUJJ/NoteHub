import { useState } from 'react'
import { Outlet } from 'react-router'
import FilterSidebar from '../ui/FilterSidebar'

export default function SidebarLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex">
      <aside className={`${open ? 'block' : 'hidden'} w-64 shrink-0 bg-base-200 p-4 md:block`}>
        <FilterSidebar />
      </aside>
      <div className="min-w-0 flex-1 p-4 md:p-6">
        <button className="btn btn-ghost mb-2 md:hidden" aria-label="เปิดเมนูหมวดหมู่" onClick={() => setOpen((v) => !v)}>
          ☰ หมวดหมู่
        </button>
        <Outlet />
      </div>
    </div>
  )
}
