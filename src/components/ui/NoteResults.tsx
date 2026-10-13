import CardGrid from './CardGrid'
import NoteCard from './NoteCard'
import { useFilteredNotes } from '../../hooks/useNotes'
import { useFilterStore } from '../../store/filterStore'
import { gradeLabels, subjectLabels } from '../../data/labels'

export default function NoteResults({ title }: { title: string }) {
  const { notes, isLoading, isError } = useFilteredNotes()
  const { subject, grade, keyword, resetFilters } = useFilterStore()
  const hasFilters = subject !== 'all' || grade !== 'all' || keyword !== ''

  // หัวข้อเปลี่ยนตามสิ่งที่ผู้ใช้เลือก แทนการขึ้น "โน้ตแนะนำ" ตลอด
  const filterParts = [
    subject !== 'all' ? `วิชา${subjectLabels[subject]}` : '',
    grade !== 'all' ? gradeLabels[grade] : '',
  ].filter(Boolean)
  const heading = keyword
    ? `ผลการค้นหา “${keyword}”${filterParts.length ? ` (${filterParts.join(' · ')})` : ''}`
    : filterParts.length
      ? `โน้ต${filterParts.join(' · ')}`
      : title

  const clearButton = (
    <button type="button" className="btn btn-outline btn-sm" onClick={resetFilters}>
      ล้างตัวกรอง
    </button>
  )

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">{heading}</h2>
        <div className="flex items-center gap-3">
          {!isLoading && !isError && <span className="text-sm opacity-70">พบ {notes.length} รายการ</span>}
          {hasFilters && clearButton}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg text-primary" aria-label="กำลังโหลด" />
        </div>
      )}
      {isError && <div className="alert alert-error">โหลดข้อมูลไม่สำเร็จ</div>}
      {!isLoading && !isError && notes.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="opacity-70">ไม่พบโน้ตที่ตรงกับเงื่อนไขที่เลือก</p>
          {hasFilters && clearButton}
        </div>
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
