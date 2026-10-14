import { NavLink } from 'react-router'
import { useUiStore } from '../../store/uiStore'
import { useMyFavorites } from '../../store/useFavoriteStore'
import { useAuthStore } from '../../store/authStore'

const links = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/create-post', label: 'สร้างโพสต์' },
  { to: '/matcher', label: 'Matcher' },
  { to: '/books', label: 'หนังสือ' },
  { to: '/favorites', label: 'รายการโปรด' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
]

const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'menu-active' : '')

export default function Navbar() {
  const openAuthModal = useUiStore((s) => s.openAuthModal)
  const favoriteCount = useMyFavorites().length
  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const logout = useAuthStore((s) => s.logout)

  const renderLinkLabel = (to: string, label: string) => (
    <>
      {label}
      {to === '/favorites' && favoriteCount > 0 && (
        <span className="badge badge-primary badge-sm ml-1 h-5 min-w-5 shrink-0 px-1.5" aria-label={`${favoriteCount} รายการโปรด`}>
          {favoriteCount}
        </span>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md">
      <div className="navbar container mx-auto max-w-7xl px-4">
      <div className="dropdown md:hidden">
        <button tabIndex={0} className="btn btn-ghost" aria-label="เปิดเมนู">☰</button>
        <ul tabIndex={0} className="menu dropdown-content z-10 mt-2 w-48 rounded-box bg-base-100 p-2 shadow">
          {links.map(({ to, label }) => (
            <li key={to}><NavLink to={to} end className={linkClass}>{renderLinkLabel(to, label)}</NavLink></li>
          ))}
          {/* จอมือถือ: ย้ายปุ่ม Admin มาไว้ในเมนู ☰ */}
          {isAdmin && <li><NavLink to="/admin" className={linkClass}>Admin</NavLink></li>}
        </ul>
      </div>
      <div className="min-w-0 flex-1">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-primary sm:text-xl">
          <img src="/images/logo.svg" alt="โลโก้ NotesHub" width={36} height={36} className="h-7 w-7 shrink-0 sm:h-9 sm:w-9" />
          {/* จอมือถือ: โลโก้กับตัวอักษรเล็กลง ปุ่มด้านขวาจะได้ไม่ทับ */}
          <span className="truncate">NotesHub</span>
        </NavLink>
      </div>
      <nav className="hidden flex-none md:block">
        <ul className="menu menu-horizontal gap-1">
          {links.map(({ to, label }) => (
            <li key={to}><NavLink to={to} end className={linkClass}>{renderLinkLabel(to, label)}</NavLink></li>
          ))}
        </ul>
      </nav>
      {user ? (
        <div className="flex flex-none items-center gap-2">
          {isAdmin && <NavLink to="/admin" className="btn btn-ghost btn-sm hidden md:inline-flex">Admin</NavLink>}
          <span className="flex items-center gap-2 text-sm font-semibold" title={user.email}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-content">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden max-w-32 truncate sm:inline">{user.name}</span>
          </span>
          <button className="btn btn-outline btn-sm md:btn-md" onClick={logout}>ออกจากระบบ</button>
        </div>
      ) : (
        <div className="flex flex-none items-center gap-2">
          <button className="btn btn-outline btn-sm md:btn-md" onClick={() => openAuthModal('login')}>เข้าสู่ระบบ</button>
          {/* จอมือถือซ่อนปุ่มสมัคร (สมัครได้จากลิงก์ในหน้าต่างเข้าสู่ระบบ) */}
          <button className="btn btn-primary btn-sm md:btn-md hidden sm:inline-flex" onClick={() => openAuthModal('register')}>สมัครสมาชิก</button>
        </div>
      )}
      </div>
    </header>
  )
}
