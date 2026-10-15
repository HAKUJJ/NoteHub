import { Link, useNavigate, useParams } from 'react-router'
import { gradeLabels, subjectLabels, typeLabels } from '../data/labels'
import { useDeleteNote, useNote } from '../hooks/useNotes'
import { isUserNote } from '../api/notes'
import { useAuthStore } from '../store/authStore'
import { useFavoriteStore } from '../store/useFavoriteStore'
import FavoriteButton from '../components/ui/FavoriteButton'
import Attachment from '../components/ui/Attachment'

function noteImageUrl(image: string, width = 1200, height = 600) {
  return `https://images.unsplash.com/${image}?w=${width}&h=${height}&fit=crop&auto=format&q=80`
}

export default function PostPage() {
  const { id } = useParams()
  const { data: note, isLoading } = useNote(Number(id))
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const removeEverywhere = useFavoriteStore((s) => s.removeEverywhere)
  const deleteNote = useDeleteNote()

  if (isLoading) {
    return <div className="p-6"><span className="loading loading-spinner loading-lg" aria-label="กำลังโหลด" /></div>
  }

  if (!note) {
    return (
      <div className="p-6 text-center">
        <h1 className="mb-4 text-2xl font-bold">ไม่พบโน้ตที่ต้องการ</h1>
        <Link to="/" className="btn btn-primary">กลับหน้าแรก</Link>
      </div>
    )
  }

  // เป็นเจ้าของโพสต์ = โพสต์ที่สร้างเอง และอีเมล (หรือชื่อ สำหรับโพสต์เก่า) ตรงกับคนที่ล็อกอิน
  const isOwner = !!user && isUserNote(note.id) &&
    (note.authorEmail ? note.authorEmail === user.email : note.author === user.name)
  // Admin ลบโพสต์ที่ผู้ใช้สร้างได้ทุกโพสต์ (เช่นโพสต์ไม่เหมาะสม) ส่วนโน้ตตัวอย่างยังลบไม่ได้
  const canDelete = isOwner || (isAdmin && isUserNote(note.id))

  const handleDelete = () => {
    if (!window.confirm(`ลบโพสต์ "${note.title}" ใช่ไหม? ลบแล้วกู้คืนไม่ได้`)) return
    deleteNote.mutate(note.id, {
      onSuccess: () => {
        removeEverywhere('note', String(note.id))
        navigate('/', { replace: true })
      },
    })
  }

  return (
    <article className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <Link to="/" className="link link-primary inline-block">← กลับหน้าแรก</Link>
      <header className="overflow-hidden rounded-box bg-white shadow-md">
        {note.image ? (
          <img src={noteImageUrl(note.image)} alt="" className="h-56 w-full object-cover md:h-80" />
        ) : (
          <div className="flex h-56 items-center justify-center bg-primary text-7xl font-bold text-primary-content md:h-80">
            {note.subject.charAt(0)}
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-outline">{note.subject}</span>
            <span className="badge badge-outline">{subjectLabels[note.category]}</span>
            <span className="badge badge-outline">{gradeLabels[note.grade]}</span>
            <span className="badge badge-secondary">{typeLabels[note.type]}</span>
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <h1 className="text-3xl font-extrabold text-primary">{note.title}</h1>
            <FavoriteButton kind="note" id={String(note.id)} title={note.title} subtitle={`โพสต์โดย: ${note.author}`} note={note} className="btn-md shrink-0" />
          </div>
          <p className="mt-2 text-gray-600">โพสต์โดย: {note.author}</p>
          {note.pages && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-box bg-base-200/60 px-4 py-3">
              <span className="text-xl text-primary" aria-hidden>▤</span>
              <span className="font-semibold">{note.pages} หน้า</span>
            </div>
          )}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-box bg-white p-6 shadow-sm md:p-8">
          <div>
            <h2 className="text-xl font-bold text-primary">รายละเอียด</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">
              {note.description || 'ยังไม่มีรายละเอียดเพิ่มเติม'}
            </p>
          </div>
          {note.topics && note.topics.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary">หัวข้อในเอกสาร</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.topics.map((topic) => <span key={topic} className="badge badge-outline border-gray-300 px-3 py-3 text-gray-700">{topic}</span>)}
              </div>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4 rounded-box bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold">ข้อมูลเอกสาร</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-gray-500">รายวิชา</dt><dd className="text-right font-medium">{note.subject}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-gray-500">ระดับชั้น</dt><dd className="font-medium">{gradeLabels[note.grade]}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-gray-500">ประเภท</dt><dd className="font-medium">{typeLabels[note.type]}</dd></div>
              {note.pages && <div className="flex justify-between gap-3"><dt className="text-gray-500">จำนวนหน้า</dt><dd className="font-medium">{note.pages}</dd></div>}
            </dl>
          </div>
          {note.relatedBookSubject && (
            <Link to={`/books?subject=${encodeURIComponent(note.relatedBookSubject)}`} className="btn btn-outline mt-auto">
              ค้นหาหนังสือที่เกี่ยวข้อง
            </Link>
          )}
          {note.attachment
            ? <Attachment noteId={note.id} info={note.attachment} />
            : <p className="rounded-box bg-base-200/60 p-3 text-center text-sm opacity-70">โพสต์นี้ไม่มีไฟล์แนบ</p>}
          {canDelete && (
            <button className="btn btn-outline btn-error" onClick={handleDelete} disabled={deleteNote.isPending}>
              {deleteNote.isPending ? 'กำลังลบ...' : isOwner ? 'ลบโพสต์นี้' : 'ลบโพสต์นี้ (Admin)'}
            </button>
          )}
          {deleteNote.isError && <p className="text-sm text-error" role="alert">ลบโพสต์ไม่สำเร็จ</p>}
        </aside>
      </section>
    </article>
  )
}
