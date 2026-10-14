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
      className={`btn btn-circle btn-sm ${active ? 'btn-secondary' : 'btn-ghost'} ${className}`}
      aria-label={active ? `นำ ${item.title} ออกจากรายการโปรด` : `เพิ่ม ${item.title} ในรายการโปรด`}
      aria-pressed={active}
      title={!email ? 'เข้าสู่ระบบเพื่อบันทึกรายการโปรด' : active ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
      onClick={handleClick}
    >
      <span aria-hidden className="text-lg leading-none">{active ? '♥' : '♡'}</span>
    </button>
  )
}
