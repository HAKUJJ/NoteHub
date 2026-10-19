import { useFavoriteStore, useMyFavorites, type FavoriteItem } from '../../store/useFavoriteStore'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'

type Props = Omit<FavoriteItem, 'savedAt'> & { className?: string }

export default function FavoriteButton({ className = '', ...item }: Props) {
  const email = useAuthStore((s) => s.user?.email)
  const myFavorites = useMyFavorites()
  const active = myFavorites.some((favorite) => favorite.kind === item.kind && favorite.id === item.id)
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)
  const openAuthModal = useUiStore((s) => s.openAuthModal)

  const handleClick = () => {
    // ยังไม่ล็อกอิน → เปิดหน้าต่างเข้าสู่ระบบแทน
    if (!email) {
      openAuthModal('login')
      return
    }
    toggleFavorite(email, item)
  }

  return (
    <button
      type="button"
      className={`btn btn-circle btn-sm btn-ghost ${className}`}
      aria-label={active ? `นำ ${item.title} ออกจากรายการโปรด` : `เพิ่ม ${item.title} ในรายการโปรด`}
      aria-pressed={active}
      title={!email ? 'เข้าสู่ระบบเพื่อบันทึกรายการโปรด' : active ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
      onClick={handleClick}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 ${active ? 'fill-rose-400 stroke-rose-400' : 'fill-none stroke-gray-500'}`}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  )
}
