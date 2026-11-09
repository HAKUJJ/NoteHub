import CardGrid from './CardGrid'
import NoteCard from './NoteCard'
import { useFilteredNotes } from '../../hooks/useNotes'
import { useFilterStore } from '../../store/filterStore'
import { gradeLabels, subjectLabels } from '../../data/labels'

export default function NoteResults({ title }: { title: string }) {
  const { notes, isLoading, isError, pagination, refetch } = useFilteredNotes()
  const { subject, grade, keyword, page, type, sort, setPage, setType, setSort, resetFilters } = useFilterStore()
  const hasFilters = subject !== 'all' || grade !== 'all' || keyword !== '' || type !== 'all' || sort !== 'newest'

  // หัวข้อเปลี่ยนตามสิ่งที่ผู้ใช้เลือก แทนการขึ้น "โน้ตแนะนำ" ตลอด
  const filterParts = [
    subject !== 'all' ? `วิชา${subjectLabels[subject]}` : '',
    grade !== 'all' ? gradeLabels[grade] : '',
  ].filter(Boolean)
  const heading = keyword
    ? `ผลการค้นหา “${keyword}”${filterParts.length ? ` (${filterParts.join(' · ')})` : ''}`
    : filterParts.length
      ? `โน้ต ${filterParts.join(' · ')}`
      : title

  const clearButton = (
    <button type="button" className="btn btn-outline btn-sm border-none focus:ring-0 focus:outline-none hover:bg-accent rounded-2xl" onClick={resetFilters}>
      ล้างตัวกรอง
    </button>
  )

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">{heading}</h2>
        <div className="flex items-center gap-3">
          {!isLoading && !isError && <span className="text-sm opacity-70">พบ {pagination?.total ?? 0} รายการ</span>}
          {hasFilters && clearButton}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select aria-label="ประเภทโน้ต" className="select select-bordered bg-white" value={type} onChange={e=>setType(e.target.value)}><option value="all">ทุกประเภท</option><option value="note">สรุปเนื้อหา</option><option value="exam">ข้อสอบเก่า</option></select>
        <select aria-label="เรียงลำดับ" className="select select-bordered bg-white" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">ใหม่ล่าสุด</option><option value="oldest">เก่าสุด</option><option value="title">ชื่อโน้ต</option></select>
      </div>
      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg text-primary" aria-label="กำลังโหลด" />
        </div>
      )}
      {isError && <div className="alert alert-error" role="alert">โหลดข้อมูลไม่สำเร็จ <button className="btn btn-sm" onClick={()=>void refetch()}>ลองอีกครั้ง</button></div>}
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
      {pagination && pagination.pages > 1 && <nav aria-label="แบ่งหน้า" className="mt-6 flex items-center justify-center gap-3"><button className="btn btn-sm" disabled={page<=1} onClick={()=>setPage(page-1)}>ก่อนหน้า</button><span>{page} / {pagination.pages}</span><button className="btn btn-sm" disabled={page>=pagination.pages} onClick={()=>setPage(page+1)}>ถัดไป</button></nav>}
    </section>
  )
}
