import { useFavoriteStore, type FavoriteItem } from '../../store/useFavoriteStore'

type Props = Omit<FavoriteItem, 'savedAt'> & { className?: string }

export default function FavoriteButton({ className = '', ...item }: Props) {
  const active = useFavoriteStore((state) => state.items.some((favorite) => favorite.kind === item.kind && favorite.id === item.id))
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)

  return (
    <button
      type="button"
      className={`btn btn-circle btn-sm ${active ? 'btn-secondary' : 'btn-ghost'} ${className}`}
      aria-label={active ? `นำ ${item.title} ออกจากรายการโปรด` : `เพิ่ม ${item.title} ในรายการโปรด`}
      aria-pressed={active}
      title={active ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
      onClick={() => toggleFavorite(item)}
    >
      <span aria-hidden className="text-lg leading-none">{active ? '♥' : '♡'}</span>
    </button>
  )
}
