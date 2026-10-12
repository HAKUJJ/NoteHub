import { Link, useParams } from 'react-router'
import { gradeLabels, subjectLabels, typeLabels } from '../data/labels'
import { useNote } from '../hooks/useNotes'

export default function PostPage() {
  const { id } = useParams()
  const { data: note, isLoading } = useNote(Number(id))

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

  return (
    <article className="mx-auto max-w-3xl p-6">
      <Link to="/" className="link mb-4 inline-block">← กลับหน้าแรก</Link>
      <div className="flex h-40 items-center justify-center rounded-box bg-primary text-6xl font-bold text-primary-content">
        {note.subject.charAt(0)}
      </div>
      <h1 className="mt-4 text-3xl font-bold">{note.title}</h1>
      <p className="mt-1 opacity-70">โพสต์โดย: {note.author}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="badge badge-outline">{note.subject}</span>
        <span className="badge badge-outline">{subjectLabels[note.category]}</span>
        <span className="badge badge-outline">{gradeLabels[note.grade]}</span>
        <span className="badge badge-secondary">{typeLabels[note.type]}</span>
      </div>
      <h2 className="mt-6 text-lg font-semibold">รายละเอียด</h2>
      <p className="mt-1 whitespace-pre-line">{note.description ?? 'ยังไม่มีรายละเอียดเพิ่มเติม'}</p>
      <button className="btn btn-primary mt-6" disabled>ดาวน์โหลด (เร็ว ๆ นี้)</button>
    </article>
  )
}
