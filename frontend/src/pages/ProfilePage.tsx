import { Link } from 'react-router'
import { useRef, useState, type ChangeEvent } from 'react'
import CardGrid from '../components/ui/CardGrid'
import NoteCard from '../components/ui/NoteCard'
import { useNotes } from '../hooks/useNotes'
import { useAuthStore, type AuthUser } from '../store/authStore'
import { useFavorites } from '../store/useFavoriteStore'
import { useUiStore } from '../store/uiStore'
import { encodeCover } from '../lib/noteCover'

export default function ProfilePage() {
  const user = useAuthStore(s => s.user)
  const openAuthModal = useUiStore(s => s.openAuthModal)

  if (!user) return (
    <div className="mx-auto max-w-xl p-6">
      <section className="rounded-box bg-white p-8 text-center shadow-md">
        <h1 className="text-2xl font-bold text-primary">เข้าสู่ระบบเพื่อดูโปรไฟล์</h1>
        <p className="mt-3 text-gray-600">จัดการโพสต์และดูรายการที่บันทึกไว้ของคุณ</p>
        <button className="btn btn-primary mt-5" onClick={() => openAuthModal('login')}>เข้าสู่ระบบ</button>
      </section>
    </div>
  )

  return <ProfileContent key={user.id} user={user} />
}

function ProfileContent({ user }: { user: AuthUser }) {
  const avatarInput = useRef<HTMLInputElement>(null)
  const updateAvatar = useAuthStore(s => s.updateAvatar)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [avatarSaved, setAvatarSaved] = useState(false)
  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSavingAvatar(true)
    setAvatarError('')
    setAvatarSaved(false)
    try {
      await updateAvatar(await encodeCover(file))
      setAvatarSaved(true)
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : 'เปลี่ยนรูปโปรไฟล์ไม่สำเร็จ')
    } finally {
      setSavingAvatar(false)
      if (avatarInput.current) avatarInput.current.value = ''
    }
  }
  const notes = useNotes()
  const favorites = useFavorites()
  const myNotes = (notes.data ?? []).filter(note => note.authorId === user.id)

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6">
      <section className="overflow-hidden rounded-box bg-white shadow-md" aria-labelledby="profile-heading">
        <div className="h-24 bg-linear-to-r from-primary to-primary/60 sm:h-32" />
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <button type="button" className="group relative flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary text-4xl font-bold text-primary-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait"
                aria-label="เปลี่ยนรูปโปรไฟล์" title="เปลี่ยนรูปโปรไฟล์" disabled={savingAvatar} onClick={() => avatarInput.current?.click()}>
                {user.avatar ? <img src={user.avatar} alt="รูปโปรไฟล์ของคุณ" className="h-full w-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                <span className={`absolute inset-0 flex items-center justify-center bg-black/45 text-white transition-opacity ${savingAvatar ? 'opacity-100' : '[@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
                  {savingAvatar ? <span className="loading loading-spinner loading-sm" aria-hidden="true" /> : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-7" aria-hidden="true">
                      <path d="m16 3 5 5-12 12-6 1 1-6L16 3Z" /><path d="m13 6 5 5M4 15l5 5" />
                    </svg>
                  )}
                </span>
              </button>
              <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="เลือกรูปโปรไฟล์" className="hidden" onChange={handleAvatarChange} disabled={savingAvatar} />
            </div>
            <Link to="/create-post" className="btn btn-primary rounded-box">สร้างโพสต์ใหม่</Link>
          </div>
          <p role="status" className="mt-2 text-sm text-primary">{savingAvatar ? 'กำลังบันทึกรูปโปรไฟล์...' : avatarSaved ? 'เปลี่ยนรูปโปรไฟล์แล้ว' : ''}</p>
          {avatarError && <p role="alert" className="mt-2 text-sm text-error">{avatarError}</p>}
          <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-secondary">My profile</p>
          <h1 id="profile-heading" className="mt-1 break-words text-3xl font-extrabold text-primary">{user.name}</h1>
          <p className="mt-2 break-all text-gray-600">{user.email}</p>
          <span className="badge badge-outline mt-3">{user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิก NotesHub'}</span>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-box bg-primary/5 p-4">
              <dt className="text-sm text-gray-600">โพสต์ของฉัน</dt>
              <dd className="mt-1 text-2xl font-bold text-primary">{notes.isPending || notes.isError ? '—' : myNotes.length}</dd>
            </div>
            <div className="rounded-box bg-secondary/5 p-4">
              <dt><Link to="/favorites" className="link text-sm text-gray-600">รายการโปรด</Link></dt>
              <dd className="mt-1 text-2xl font-bold text-primary">{favorites.isPending || favorites.isError ? '—' : favorites.data?.length ?? 0}</dd>
            </div>
          </dl>
          {favorites.isError && <p role="alert" className="mt-3 text-sm text-error">โหลดจำนวนรายการโปรดไม่สำเร็จ <button className="link" onClick={() => void favorites.refetch()}>ลองอีกครั้ง</button></p>}
        </div>
      </section>

      <section aria-labelledby="my-posts-heading">
        <h2 id="my-posts-heading" className="mb-4 text-2xl font-bold text-primary">โพสต์ของฉัน</h2>
        {notes.isPending ? (
          <p role="status" className="rounded-box bg-white p-6">กำลังโหลดโพสต์...</p>
        ) : notes.isError ? (
          <div role="alert" className="alert alert-error">
            <span>โหลดโพสต์ไม่สำเร็จ</span>
            <button className="btn btn-sm" onClick={() => void notes.refetch()}>ลองอีกครั้ง</button>
          </div>
        ) : myNotes.length === 0 ? (
          <div className="rounded-box bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold">คุณยังไม่มีโพสต์</p>
            <p className="mt-2 text-gray-600">เริ่มแบ่งปันสรุปเนื้อหาหรือข้อสอบเก่าให้เพื่อน ๆ</p>
            <Link to="/create-post" className="btn btn-primary mt-5">สร้างโพสต์แรก</Link>
          </div>
        ) : (
          <CardGrid>
            {myNotes.map((note, index) => (
              <NoteCard key={note.id} note={note} colorIndex={index} />
            ))}
          </CardGrid>
        )}
      </section>
    </div>
  )
}
