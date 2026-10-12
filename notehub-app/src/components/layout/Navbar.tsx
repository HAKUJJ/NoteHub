import { NavLink } from 'react-router'
import { useUiStore } from '../../store/uiStore'

const links = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/create-post', label: 'สร้างโพสต์' },
  { to: '/matcher', label: 'Matcher' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
]

const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'menu-active' : '')

export default function Navbar() {
  const openAuthModal = useUiStore((s) => s.openAuthModal)

  return (
    <header className="navbar sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md">
      <div className="dropdown md:hidden">
        <button tabIndex={0} className="btn btn-ghost" aria-label="เปิดเมนู">☰</button>
        <ul tabIndex={0} className="menu dropdown-content z-10 mt-2 w-48 rounded-box bg-base-100 p-2 shadow">
          {links.map(({ to, label }) => (
            <li key={to}><NavLink to={to} end className={linkClass}>{label}</NavLink></li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <img src="/images/logo.svg" alt="โลโก้ NotesHub" width={36} height={36} />
          <span>NotesHub</span>
        </NavLink>
      </div>
      <nav className="hidden flex-none md:block">
        <ul className="menu menu-horizontal gap-1">
          {links.map(({ to, label }) => (
            <li key={to}><NavLink to={to} end className={linkClass}>{label}</NavLink></li>
          ))}
        </ul>
      </nav>
      <div className="flex-none gap-2">
        <button className="btn btn-outline btn-sm md:btn-md" onClick={() => openAuthModal('login')}>เข้าสู่ระบบ</button>
        <button className="btn btn-primary btn-sm md:btn-md" onClick={() => openAuthModal('register')}>สมัครสมาชิก</button>
      </div>
    </header>
  )
}
