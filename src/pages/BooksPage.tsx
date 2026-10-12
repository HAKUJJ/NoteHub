import { useState, type FormEvent } from 'react'
import BookCard from '../components/ui/BookCard'
import { bookSubjects } from '../api/openLibrary'
import { useBooks } from '../hooks/useBooks'
import { useSearchParams } from 'react-router'

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSubject = searchParams.get('subject')
  const selectedSubject = bookSubjects.find((item) => item.key === requestedSubject || item.subject === requestedSubject)
  const subjectKey = selectedSubject?.key
  const subject = selectedSubject?.subject ?? requestedSubject ?? bookSubjects[0].subject
  const subjectLabel = selectedSubject?.label ?? 'หนังสือแนะนำ'
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const { data, isLoading, isError, error, refetch, isFetching } = useBooks(subject, query)

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQuery(draft.trim())
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Open Library</p>
        <h1 className="mt-1 text-3xl font-extrabold text-primary">คลังหนังสือ</h1>
        <p className="mt-2 text-gray-600">ค้นหาหนังสืออ่านเพิ่มเติมจาก Open Library</p>
      </header>

      <form onSubmit={submitSearch} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="ค้นหาชื่อหนังสือหรือผู้เขียน..."
          className="input input-bordered w-full border border-gray-300 bg-white sm:max-w-xl"
          aria-label="ค้นหาหนังสือ"
        />
        <button type="submit" className="btn btn-primary">ค้นหา</button>
        {query && <button type="button" className="btn btn-ghost" onClick={() => { setDraft(''); setQuery('') }}>ล้างคำค้น</button>}
      </form>

      <div role="tablist" className="tabs tabs-boxed flex-wrap bg-base-200/70">
        {bookSubjects.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={subjectKey === item.key}
            className={`tab ${subjectKey === item.key ? 'tab-active font-semibold' : ''}`}
            onClick={() => setSearchParams({ subject: item.key })}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section aria-live="polite">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{query ? `ผลการค้นหา “${query}”` : `หนังสือ${subjectLabel}`}</h2>
          {data && <span className="text-sm text-gray-500">พบ {data.total.toLocaleString()} รายการ</span>}
        </div>

        {(isLoading || (isFetching && !data)) && (
          <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" aria-label="กำลังโหลดหนังสือ" /></div>
        )}
        {isError && (
          <div className="alert alert-error">
            <div><p className="font-semibold">โหลดข้อมูลจาก Open Library ไม่สำเร็จ</p><p className="text-sm">{error instanceof Error ? error.message : 'โปรดลองอีกครั้ง'}</p></div>
            <button className="btn btn-sm" onClick={() => void refetch()}>ลองอีกครั้ง</button>
          </div>
        )}
        {!isLoading && !isError && data?.books.length === 0 && (
          <div className="rounded-box bg-white p-12 text-center text-gray-500 shadow-sm">ไม่พบหนังสือ ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</div>
        )}
        {!isError && data && data.books.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </section>

      <p className="text-center text-xs text-gray-500">ข้อมูลและปกหนังสือจัดทำโดย Open Library</p>
    </div>
  )
}
