import { useState } from 'react'
import { Outlet } from 'react-router'
import FilterSidebar from '../ui/FilterSidebar'

export default function SidebarLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex w-full max-w-full gap-6">
      <aside className={`${open ? 'block' : 'hidden'} w-64 shrink-0 self-start rounded-box bg-base-200 p-4 md:block `}>
        <FilterSidebar />
      </aside>
      <div className="min-w-0 flex-1 py-4 md:py-6 border-none">
        <button className="btn btn-ghost mb-2 md:hidden focus:ring-0 border-none focus:outline-none rounded-box hover:bg-accent " aria-label="เปิดเมนูหมวดหมู่" onClick={() => setOpen((v) => !v)}>
          ☰ หมวดหมู่
        </button>
        <Outlet />
      </div>
    </div>
  )
}
