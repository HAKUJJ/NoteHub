import { Link, useParams } from 'react-router'
import FavoriteButton from '../components/ui/FavoriteButton'
import { getBookCoverUrl } from '../api/openLibrary'
import { useBook } from '../hooks/useBooks'

export default function BookDetailPage() {
  const { id = '' } = useParams()
  const { data: book, isLoading, isError, error, refetch } = useBook(id)

  if (isLoading) {
    return <div className="flex justify-center p-16"><span className="loading loading-spinner loading-lg text-primary" aria-label="กำลังโหลดรายละเอียดหนังสือ" /></div>
  }

  if (isError || !book) {
    return (
      <section className="mx-auto max-w-2xl space-y-4 p-6 text-center">
        <h1 className="text-2xl font-bold">โหลดรายละเอียดหนังสือไม่สำเร็จ</h1>
        <p className="text-gray-600">{error instanceof Error ? error.message : 'ไม่พบหนังสือที่ต้องการ'}</p>
        <div className="flex justify-center gap-2">
          {isError && <button className="btn btn-primary" onClick={() => void refetch()}>ลองอีกครั้ง</button>}
          <Link to="/books" className="btn btn-outline">กลับไปคลังหนังสือ</Link>
        </div>
      </section>
    )
  }

  const authors = book.authors.join(', ') || 'ไม่ระบุผู้เขียน'

  return (
    <article className="mx-auto max-w-5xl p-4 md:p-8">
      <Link to="/books" className="link link-primary mb-6 inline-block">← กลับไปคลังหนังสือ</Link>
      <div className="grid gap-8 rounded-box bg-white p-6 shadow-md md:grid-cols-[minmax(220px,320px)_1fr] md:p-8">
        <div className="flex min-h-72 items-center justify-center rounded-box bg-base-200/50 p-4">
          {book.coverId ? (
            <img src={getBookCoverUrl(book.coverId, 'L')} alt={`ปกหนังสือ ${book.title}`} className="max-h-[28rem] max-w-full object-contain shadow-lg" />
          ) : (
            <span className="text-gray-500">ไม่มีภาพปก</span>
          )}
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Open Library</p>
              <h1 className="mt-2 text-3xl font-extrabold text-primary">{book.title}</h1>
            </div>
            <FavoriteButton kind="book" id={book.id} title={book.title} subtitle={authors} coverId={book.coverId} />
          </div>
          <p className="text-gray-600">ผู้เขียน: {authors}</p>
          {book.firstPublished && <p className="text-sm text-gray-500">พิมพ์ครั้งแรก: {book.firstPublished}</p>}
          <div>
            <h2 className="mb-2 text-lg font-bold border-none rounded-box hover:bg-accent ">รายละเอียด</h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{book.description || 'ไม่มีรายละเอียดเพิ่มเติมจาก Open Library'}</p>
          </div>
          {book.subjects.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-bold">หัวข้อ</h2>
              <div className="flex flex-wrap gap-2">
                {book.subjects.map((subject) => <span key={subject} className="badge badge-outline border-gray-300 text-gray-600">{subject}</span>)}
              </div>
            </div>
          )}
          <a href={book.url} target="_blank" rel="noreferrer" className="btn btn-primary mt-auto">ดูบน Open Library ↗</a>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-gray-500">ข้อมูลและปกหนังสือจัดทำโดย Open Library</p>
    </article>
  )
}
