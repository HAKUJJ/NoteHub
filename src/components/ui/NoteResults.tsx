import CardGrid from './CardGrid'
import NoteCard from './NoteCard'
import { useFilteredNotes } from '../../hooks/useNotes'

export default function NoteResults({ title }: { title: string }) {
  const { notes, isLoading, isError } = useFilteredNotes()

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {!isLoading && !isError && <span className="text-sm opacity-70">พบ {notes.length} รายการ</span>}
      </div>

      {isLoading && <span className="loading loading-spinner loading-lg" aria-label="กำลังโหลด" />}
      {isError && <div className="alert alert-error">โหลดข้อมูลไม่สำเร็จ</div>}
      {!isLoading && !isError && notes.length === 0 && (
        <p className="py-8 text-center opacity-70">ไม่พบโน้ตที่ตรงกับเงื่อนไขที่เลือก</p>
      )}
      {notes.length > 0 && (
        <CardGrid>
          {notes.map((note, i) => (
            <NoteCard key={note.id} note={note} colorIndex={i} />
          ))}
        </CardGrid>
      )}
    </section>
  )
}
